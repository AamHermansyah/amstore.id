import { useState } from "react";
import axios from 'axios';
import Link from "next/link";

export default function UserRegister(){
    const [input, setInput] = useState({
        first_name: "", last_name: "", email: "", image_url: "", password: ""
    })

    const [errorMessages, setErrorMessages] = useState([]);
    const [registerFetchStatus, setRegisterFetchStatus] = useState(false);

    const handleInput = (event) => {
        setInput({
            ...input, [event.target.name]: event.target.value
        })
    }

    const handleRegister = (event) => {
        event.preventDefault();
        setRegisterFetchStatus(prevBool => !prevBool);
        const {first_name, last_name, email, image_url, password} = input

        axios.post(`https://service-example.sanbercloud.com/api/register`, {
            name: first_name + ' ' + last_name,
            email,
            image_url,
            password
        })
        .then(res => {
                if(res.status === 201){
                    console.log(res);
                    setInput({
                        first_name: "", last_name: "", email: "", image_url: "", password: ""
                    });
                    window.location = "/auth/login-user"
                }
                setRegisterFetchStatus(prevBool => !prevBool);
            })
        .catch(err => {
            if(err.response.status === 400){
                setErrorMessages([]);
                const errorDataMessage = JSON.parse(err.response.data)
                Object.keys(errorDataMessage).forEach(key => {
                    setErrorMessages(prevState => [...prevState, errorDataMessage[key]])
                });
                setRegisterFetchStatus(prevBool => !prevBool);
            } else {
                alert(err)
            }
        });
    }

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="flex flex-col border border-gray-300 max-w-md px-4 py-8 bg-white rounded-lg shadow-md dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
                <div className="self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white">
                    Create a new account
                </div>
                <span className="justify-center text-sm text-center text-gray-500 flex-items-center dark:text-gray-400">
                    Already have an account ?
                    <Link href="user-login">
                        <a className="text-sm text-blue-500 underline hover:text-blue-700">
                            Sign in
                        </a>
                    </Link>
                </span>
                <div className="p-6 mt-8">
                    <form action="#" onSubmit={handleRegister}>
                        <div className="flex gap-4 mb-2">
                            <div className=" relative ">
                                <input type="text"
                                id="create-account-first-name" 
                                className=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent" 
                                name="first_name" 
                                placeholder="First name"
                                onChange={handleInput}
                                value={input.first_name}/>
                            </div>
                            <div className=" relative ">
                                <input type="text" 
                                id="create-account-last-name" 
                                className=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent" 
                                name="last_name" 
                                placeholder="Last name"
                                onChange={handleInput}
                                value={input.last_name}/>
                            </div>
                        </div>
                        <div className="flex flex-col mb-2">
                            <div className=" relative ">
                                <input type="email" 
                                id="create-account-email" 
                                className=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent" 
                                name="email" 
                                placeholder="Email"
                                onChange={handleInput}
                                value={input.email}/>
                            </div>
                        </div>
                        <div className="flex flex-col mb-2">
                            <div className=" relative ">
                                <input type="text" 
                                id="create-account-image-url" 
                                className=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent" 
                                name="image_url" 
                                placeholder="Image Url"
                                onChange={handleInput}
                                value={input.image_url}/>
                            </div>
                        </div>
                        <div className="flex flex-col mb-2">
                            <div className=" relative ">
                                <input type="password" 
                                id="create-account-password" 
                                className=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent" 
                                name="password" 
                                placeholder="Create password"
                                onChange={handleInput}
                                value={input.password}/>
                            </div>
                        </div>
                        
                        <div className="flex flex-col mb-2">
                            {errorMessages.length > 0 && errorMessages.map((error, index) => (
                                <p className="text-[.9rem] text-red-600" key={index}>{error}</p>
                            ))}
                        </div>
                        
                        <div className="flex w-full my-4">
                            <button type="submit"
                            className="py-2 px-4  bg-green-700 hover:bg-green-800 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg disabled:cursor-not-allowed disabled:opacity-75"
                            disabled={registerFetchStatus} >
                                {registerFetchStatus ? "Loading..." : "Register"}
                            </button>
                        </div>
                    </form>
                </div>              
            </div>
        </div>
    )
}