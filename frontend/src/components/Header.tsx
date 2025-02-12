import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";

export default function Header() {
    return (
        <header className="grid grid-cols-8 gap-4 p-2 bg-gray-100  dark:bg-gray-800  justify-items-center text-lg">
            <div className="flex items-center"> Home </div>
            <div className="flex items-center"> Category </div>
            <div className="col-span-3 flex items-center w-full"> <SearchBar /> </div>
            <div className="flex items-center"> Account </div>
            <div className="flex items-center"> Cart </div>
            <div className="flex items-center"> <ThemeToggle /> </div>
        </header>
    );
}