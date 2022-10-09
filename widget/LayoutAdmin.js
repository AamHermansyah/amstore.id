import Cookies from "js-cookie";
import Link from "next/link"
import { useState } from "react";
import Footer from "../components/Footer";

const links = [
    {
        id: 'dashboard',
        title: 'Products',
        href: '/dashboard',
        icon: () => (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        )
    },
    {
        id: 'category',
        title: 'Categories',
        href: '/admin/category',
        icon: () => (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
        )
    },
    {
        id: 'transaction',
        title: 'Transactions',
        href: '/admin/transaction',
        icon: () => (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        )
    },
    {
        id: 'checkout',
        title: 'Checkouts',
        href: '/admin/checkout',
        icon: () => (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        )
    }
]

export default function LayoutAdmin({children, active}){
    const [navbarActive, setNavbarActive] = useState(true);

    const handleLogout = (event) => {
        event.preventDefault();
        Cookies.remove("admin");
        Cookies.remove("token_admin");
        window.location = "/auth/admin-login"
    }

    return (
        <>
            <div className={`${navbarActive ? 'fixed' : 'hidden'} h-screen rounded-2xl shadow-lg dark:bg-gray-700 w-[250px] md:w-[300px] p-4 z-20 bg-white`}>
                <div className="flex items-center justify-center pt-6">
                    <Link href="/">
                        <a className="mt-2 text-xl">amstore.id</a>
                    </Link>
                </div>
                <nav className="mt-6">
                    {links.map(link => (
                        <Link href={link.href} key={link.id} >
                            <a id={link.id}
                            className={`${active === link.id ? 'bg-green-500 text-white' : ''} w-full font-thin uppercase flex items-center p-4 my-2 rounded-full transition-colors duration-200 justify-start dark:from-gray-700 dark:to-gray-800`}>
                                <span className="text-left">
                                    {link.icon()}
                                </span>
                                <span className="mx-4 text-sm font-normal">
                                    {link.title}
                                </span>
                            </a>
                        </Link>
                    ))}

                    <button onClick={handleLogout}
                    className={`uppercase bg-red-600 flex justify-center items-center text-white font-semibold mt-10 w-max mx-auto p-4 my-2 rounded-full transition-colors duration-200 dark:from-gray-700 dark:to-gray-800`}>
                        <span className="text-left">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </span>
                        <span className="mx-4 text-sm font-normal">
                            Logout
                        </span>
                    </button>
                </nav>
            </div>
            <div className="fixed w-screen px-6 py-2 z-10 bg-white flex md:hidden cursor-pointer justify-between items-center border-b-2 border-gray-200">
                <h1 className="text-xl">amstore.id</h1>
                <div id="hamburger_nav"
                className={`w-12 h-12 bg-white border-2 p-1 border-green-500 rounded-md flex flex-col justify-center items-center gap-1`}
                onClick={() => setNavbarActive(prevBool => !prevBool)}>
                    <span className={`origin-bottom-left w-full h-1 bg-green-500 rounded-sm`} 
                     style={{
                        transform: navbarActive ? 'rotate(45deg) translate(3px, 2px)' : ''
                    }} />
                    <span className={`${navbarActive && 'hidden'} w-full h-1 bg-green-500 rounded-sm`} />
                    <span className={`origin-top-right w-full h-1 bg-green-500 rounded-sm`} 
                    style={{
                        transform: navbarActive ? 'rotate(-45deg) translate(3px, -2px)' : ''
                    }}/>
                </div>
            </div>
            { children }
            <div className="md:pl-[250px] lg:pl-[300px]">
                <Footer />
            </div>
        </>
    )
}