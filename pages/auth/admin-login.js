import axios from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { useState } from "react"

export default function AdminLogin(){
    const [input, setInput] = useState({ email: '', password: '' });
    const [fetchLoginStatus, setFetchLoginStatus] = useState(false);
    const [errorMessages, setErrorMessages] = useState('');

    const handleInput = (event) => {
        setInput({
            ...input,
            [event.target.name]: event.target.value
        })
    }

    const handleLogin = async (event) => {
        event.preventDefault();
        setFetchLoginStatus(prevBool => !prevBool);
        const { email, password } = input;

        try {
            const result = await axios.post(`https://service-example.sanbercloud.com/api/login-admin`, { email, password });
            const { admin, token } = result.data;
            const dataUserFromToken = jwtDecode(token);
            
            if(dataUserFromToken.role === "admin"){
                Cookies.set("admin", admin);
                Cookies.set("token_admin", token);
                setErrorMessages("");
                window.location = "/dashboard";
            } else {
                setErrorMessages("User not allowed to login here.")
            }

            setFetchLoginStatus(prevBool => !prevBool);
        } catch (error) {
            if(error.response.status === 500){
                setErrorMessages('Email or password incorrect.');
            } else alert(error);
            setFetchLoginStatus(prevBool => !prevBool);
        }
    }

    return (
        <section id="admin-login" className="w-screen h-[100vh] flex justify-center items-center">
            <div className="flex flex-col w-full max-w-md px-4 py-8 mx-auto bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
                <div className="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white">
                Login To Your Dashboard
                </div>
                <div className="mt-8">
                    <form onSubmit={handleLogin} autoComplete="off">
                        <div className="flex flex-col mb-2">
                            <div className="flex relative ">
                                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                                    <svg width={15} height={15} fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z">
                                        </path>
                                    </svg>
                                </span>
                                <input type="text" 
                                id="email" 
                                name="email" 
                                className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent" 
                                placeholder="Your email" 
                                required
                                onChange={handleInput} />
                            </div>
                        </div>
                        <div className="flex flex-col mb-2">
                            <div className="flex relative ">
                                <span className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                                    <svg width={15} height={15} fill="currentColor" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z">
                                        </path>
                                    </svg>
                                </span>
                                <input type="password" 
                                name="password" 
                                id="password" 
                                className=" rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent" 
                                placeholder="Your password" 
                                required
                                onChange={handleInput} />
                            </div>
                        </div>
                        <div className="mb-4">
                            {errorMessages.length > 0 && <p className="text-[.9rem] text-red-600">{errorMessages}</p>}
                        </div>
                        <div className="flex w-full">
                            <button type="submit" className="py-2 px-4  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={fetchLoginStatus}>
                                {fetchLoginStatus ? 'Loading...' : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}