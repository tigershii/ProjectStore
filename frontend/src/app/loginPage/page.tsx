import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 text-black dark:text-white">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}