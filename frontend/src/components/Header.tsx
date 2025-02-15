"use client";

import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";
import { useAppSelector } from "@/store/hooks";
import { selectLoggedIn } from "@/store/reducers/authReducer";
import AccountMenu from "./accountMenu";
import { useRouter } from "next/navigation";
import { Card } from "./ui/card";
import Link from "next/link";

export default function Header() {
    const loggedIn = useAppSelector(selectLoggedIn);
    const router = useRouter();

    return (
        <>
            <Card className="container py-3 px-4 border-0 flex items-center justify-between gap-6 rounded-2xl mt-5 mx-5 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                <div className="flex items-center font-semibold text-black dark:text-white">
                    Project Store
                </div>

                <ul className="hidden md:flex items-center gap-10">
                    <li>
                        <Link href="/" className="text-black dark:text-white">Home</Link> 
                    </li>
                    <li>
                        <a href="#features">Category</a>
                    </li>
                    <li>
                        <SearchBar />
                    </li>
                </ul>

                <div className="flex items-center">
                    <ul className="flex items-center gap-10">
                        <li>
                            <a href="#features">My Orders</a>
                        </li>
                        <li>
                            Cart
                        </li>
                        <li>
                            {loggedIn ? 
                            <AccountMenu /> : 
                            <button 
                                onClick={() => router.push('/loginPage')}
                                className="hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                Login
                            </button>}
                        </li>
                        <li className="mt-1">
                            <ThemeToggle />
                        </li>
                    </ul>
                </div>
            </Card>
        </>
    );
}

// <header className="grid grid-cols-8 gap-4 p-2 bg-white dark:bg-black justify-items-center text-lg border-b border-gray-300 dark:border-gray-600 text-gray-500">
        //     <div className="flex items-center"> Home </div>
        //     <div className="flex items-center"> Category </div>
        //     <div className="col-span-3 flex items-center w-full"> <SearchBar /> </div>
        //     <div className="flex items-center"> 
        //         {loggedIn ? 
        //             <AccountMenu /> : 
        //             <button 
        //                 onClick={() => router.push('/loginPage')}
        //                 className="hover:text-gray-600 dark:hover:text-gray-300"
        //             >
        //                 Login
        //             </button>
        //         } 
        //     </div>
        //     <div className="flex items-center"> Cart </div>
        //     <div className="flex items-center"> <ThemeToggle /> </div>
        
        // </header>