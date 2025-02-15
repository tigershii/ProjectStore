import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black p-4">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}