import Link from "next/link";

export default function Custom404(){
    return (
        <main className="bg-white relative overflow-hidden h-screen">
            <header className="absolute top-0 left-0 right-0 z-20">
                <nav className="container mx-auto px-6 md:px-12 py-4">
                    <div className="md:flex justify-between items-center">
                        <div className="flex justify-between items-center">
                            <div className="md:hidden">
                                <button className="text-gray-800 focus:outline-none">
                                    <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        </path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="hidden md:flex md:items-center md:justify-end space-x-4">
                            <Link href='/'>
                                <a className="px-3 py-2 transition ease-in duration-200 uppercase hover:text-green-800 text-green-700 focus:outline-none">
                                    Shop
                                </a>
                            </Link>
                            <Link href="/contact">
                                <a className="px-3 py-2 transition ease-in duration-200 uppercase hover:text-green-800 text-green-700 focus:outline-none">
                                    Contact
                                </a>
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>
            <div className="container mx-auto h-screen pt-32 md:pt-0 px-6 z-10 flex items-center justify-between">
                <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row justify-between items-center relative">
                    <div className="w-full mb-16 md:mb-8 text-center lg:text-left">
                        <h1 className="font-bold font-sans text-center lg:text-left text-[5rem] lg:text-[10rem] mb-12 md:mb-0 text-gray-700">
                            404
                        </h1>
                        <h1 className="font-light font-sans text-center lg:text-left text-4xl lg:text-6xl mt-12 md:mt-0 text-gray-700">
                            Sorry, this page isn&#x27;t available
                        </h1>
                        <Link href="/">
                            <a className="block mx-auto px-4 py-2 w-max mt-16 text-white font-light transition ease-in duration-200 hover:bg-green-800 border-2 text-lg bg-green-700 focus:outline-none">
                                Go back home
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}