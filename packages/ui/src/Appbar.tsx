import { Button } from "./button";

interface User {
    name?: string | null;
}

interface AppbarProps {
    user?: User;
    onSignin: () => void; // Explicitly typed
    onSignout: () => void; // Explicitly typed
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    return (
        <div className="flex justify-between border-b px-4">
            <div className="text-lg flex flex-col justify-center">
                PayTM
            </div>
            <div className="flex flex-col justify-center pt-2">
                <Button onClick={user ? onSignout : onSignin}>
                    {user ? "Logout" : "Login"}
                </Button>
            </div>
        </div>
    );
};
