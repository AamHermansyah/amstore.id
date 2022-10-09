import { Navbar } from "flowbite-react"
import Cookies from "js-cookie";
import Link from "next/link"
import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContextProvider";
import SearchBar from "./SearchBar";

export default function Navigation(){
    const { state, handleFunction } = useContext(GlobalContext);
    const { userCookie, setUserCookie, totalCheckout, fetchTotalCheckoutStatus, setFetchTotalCheckoutStatus } = state;
    const { handleTotalCheckout } = handleFunction;

    useEffect(() => {
        if(Cookies.get('token_user') !== undefined){
            userCookie === undefined && setUserCookie(JSON.parse(Cookies.get('user')));
        }
    }, [setUserCookie, userCookie])

    useEffect(() => {
        if(userCookie !== undefined && fetchTotalCheckoutStatus){
            handleTotalCheckout();
            setFetchTotalCheckoutStatus(prevBool => !prevBool);
        }
    }, [fetchTotalCheckoutStatus, handleTotalCheckout, setFetchTotalCheckoutStatus, userCookie])

    const handleLogout = () => {
        Cookies.remove('token_user');
        Cookies.remove('user');
        setUserCookie(undefined);
        window.location = '/auth/user-login';
    }

    return (
        <div className="px-4 lg:px-10 bg-white fixed top-0 left-0 w-full z-10 shadow-md">
            <Navbar
            fluid={true}
            rounded={true}
            >
                <Navbar.Brand href="/">
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        amstore.id
                    </span>
                </Navbar.Brand>
                <SearchBar />
                <div className="flex">
                    {userCookie ?
                        <span type="button"
                            className="md:block hidden cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            onClick={handleLogout}>
                            Logout
                        </span> :
                        <Link href="auth/user-login">
                            <a type="button"
                            className="md:block hidden text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                                Login
                            </a>
                        </Link>
                    }
                    <Navbar.Toggle />
                </div>
                <Navbar.Collapse>
                    <Navbar.Link href="/user/checkout">
                        <div className="relative w-max">
                            {userCookie && 
                                <span className="w-4 h-4 text-white text-center rounded-full absolute -top-[5px] right-0 leading text-xs bg-red-500">
                                    {totalCheckout}
                                </span>
                            }
                            <div className="px-2">
                                <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                        </div>
                    </Navbar.Link>
                    {userCookie &&
                        <Navbar.Link href="/user/transaction">
                            <div className="relative w-max">
                                <div className="px-2">
                                    <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                </div>
                            </div>
                        </Navbar.Link>
                    }
                    <div className="block md:hidden">
                        {userCookie ?
                            <span type="button"
                                className="md:hidden block w-max mt-2 ml-3 cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                onClick={handleLogout}>
                                Logout
                            </span> :
                            <Navbar.Link href="/auth/user-login">
                                <button type="button"
                                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                                    Login
                                </button>
                            </Navbar.Link>
                         }
                    </div>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}