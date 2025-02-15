"use client";

import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";
import { useAppSelector } from "@/store/hooks";
import { selectLoggedIn } from "@/store/reducers/authReducer";
import AccountMenu from "./accountMenu";
import { useRouter } from "next/navigation";

export default function Header() {
    const loggedIn = useAppSelector(selectLoggedIn);
    const router = useRouter();

    return (
        <header className="grid grid-cols-8 gap-4 p-2 bg-white dark:bg-black justify-items-center text-lg border-b border-gray-300 dark:border-gray-600 text-black dark:text-white">
            <div className="flex items-center"> Home </div>
            <div className="flex items-center"> Category </div>
            <div className="col-span-3 flex items-center w-full"> <SearchBar /> </div>
            <div className="flex items-center"> 
                {loggedIn ? 
                    <AccountMenu /> : 
                    <button 
                        onClick={() => router.push('/loginPage')}
                        className="hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        Login
                    </button>
                } 
            </div>
            <div className="flex items-center"> Cart </div>
            <div className="flex items-center"> <ThemeToggle /> </div>
            
        </header>
    );
}