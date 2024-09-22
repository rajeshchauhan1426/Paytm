export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <head>
          <title>Your App Title</title>
          {/* Add any other meta tags or links here */}
        </head>
        <body>
          {children}
        </body>
      </html>
    );
  }
  