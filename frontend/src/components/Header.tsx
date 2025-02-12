import ThemeToggle from "./ThemeToggle";

export default function Header() {
    return (
        <header className="grid grid-cols-8 gap-4 p-2 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white justify-items-center">
            <div className="flex items-center"> Home </div>
            <div className="flex items-center"> Category </div>
            <div className="col-span-3 flex items-center"> Search </div>
            <div className="flex items-center"> Account </div>
            <div className="flex items-center"> Cart </div>
            <div className="flex items-center"> <ThemeToggle /> </div>
        </header>
    );
}