import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { User } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          return null;
        }

        // Check if the user exists by phone number
        const existingUser: User | null = await db.user.findFirst({
          where: {
            number: credentials.phone // number is already a String in Prisma schema
          }
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(), // id is Int, convert to String
              name: existingUser.name,
              email: existingUser.number // number is String, no need to convert
            };
          }
          return null; // Invalid credentials
        }

        // If user does not exist, hash the password and create a new user
        const hashedPassword = await bcrypt.hash(credentials.password, 10);

        try {
          const newUser: User = await db.user.create({
            data: {
              number: credentials.phone, // phone number as String
              password: hashedPassword,
              email: `${credentials.phone}@default.com`, // example email, change this logic if necessary
            }
          });

          return {
            id: newUser.id.toString(), // Convert Int id to String
            name: newUser.name,
            email: newUser.number // No conversion needed, already a String
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    })
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }) {
      if (session?.user) {
        session.user.id = token.sub as string; // Ensure token.sub is a string
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id.toString(); // Convert Int to String
      }
      return token;
    }
  }
};
