import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { formatRupiah } from "../utils";
import SelectCategory from "./SelectCategory";

export default function AddAndEditProduct({data, isDisplay, onCancel, onSuccess}){
    const [input, setInput] = useState({
        id_category: "-1",
        product_name: '',
        description: '',
        image_url: '',
        stock: '',
        rating: '',
        price: '',
        available: 0
    });
    const [fetchEditStatus, setFetchEditStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [mode, setMode] = useState('edit');

    const handleInput = (event) => {
        if(event.target.name === "price") {
            let price = event.target.value.split('.').join('');
            setInput({
                ...input,
                price: formatRupiah(price)
            })
        } else {
            setInput({
                ...input,
                [event.target.name]: event.target.value
            })
        }
    }

    const handleAvailable = () => {
        setInput({
            ...input,
            available: input.available == 1 ? 0 : 1
        })
    }

    const handleCancel = (event) => {
        if(event) event.preventDefault();
        setErrorMessage(null);
        setInput({
            id_category: '-1',
            product_name: '',
            description: '',
            image_url: '',
            stock: '',
            rating: '',
            price: '',
            available: 0
        })
        return onCancel();
    }

    const handleEdit = async (event) => {
        event.preventDefault();
        setErrorMessage(null);
        let isError = false;
        for(let key in input){
            if(input[key] === '' || input[key] === "-1"){
                setErrorMessage('Input cannot be empty');
                isError = true;
            }
        }

        if(!isError){
            setFetchEditStatus(true);
            let {id_category, rating, stock, price, ...inputData} = input;
            price = price.split('.').join('');

            const product = {
                id_category: +id_category,
                rating: +rating,
                stock: +stock,
                price: +price,
                ...inputData
            }

            try {
                let result = await axios({
                    method: mode === 'edit' ? 'put' : 'post',
                    url: `https://service-example.sanbercloud.com/api/product${mode === 'edit' ? '/' + data.id : ''}`,
                    data: product,
                    headers: { "Authorization": "Bearer " + Cookies.get("token_admin") }
                });

                if(result?.status === 200 || result?.status === 201){
                    handleCancel();
                    onSuccess();
                } else alert(result.statusText);
                setFetchEditStatus(false);
            } catch (error) {
                console.log(error);
                setFetchEditStatus(false);
            }
        }
    }

    useEffect(() => {
        if(data){
            setMode('edit');
            setInput({
                id_category: data.category.id,
                product_name: data.product_name,
                description: data.description,
                image_url: data.image_url,
                stock: data.stock,
                rating: data.rating,
                price: formatRupiah(data.price),
                available: data.available
                })
        } else setMode('add');
    }, [data])

    return (
        <div className={`${isDisplay ? 'fixed' : 'hidden'} inset-0 bg-white bg-opacity-50 backdrop-blur-md flex justify-center items-center z-30`}>
            <form className="flex w-full max-w-sm md:max-w-md space-x-3">
                <div className="w-full max-w-2xl px-5 py-10 m-auto bg-white rounded-lg shadow dark:bg-gray-800">
                    <div className="mb-6 text-3xl font-light text-center text-gray-800 dark:text-white">
                        {mode === 'edit' ? 'Edit product' : 'Add Product'}
                    </div>
                    <div className="grid max-w-xl grid-cols-2 gap-4 m-auto">
                        <div className="col-span-2">
                            <div className=" relative ">
                                <input type="text" 
                                name="product_name"
                                value={input.product_name}
                                onChange={handleInput}
                                id="product_name" 
                                className=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                                placeholder="Name product"
                                required/>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className=" relative ">
                                <input type="number"
                                name="stock"
                                value={input.stock}
                                onChange={handleInput}
                                id="stock" 
                                className=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                                placeholder="Stock"
                                required/>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className=" relative ">
                                <input type="number" 
                                name="rating"
                                value={input.rating}
                                onChange={handleInput}
                                id="rating" 
                                className=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                                placeholder="Rating"
                                required
                                min={0}
                                max={5}/>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className=" relative ">
                                <input type="text" 
                                name="price"
                                value={input.price}
                                onChange={handleInput}
                                id="price" 
                                className=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                                placeholder="Price"
                                required/>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <SelectCategory id={input.id_category} onChange={handleInput} />
                        </div>
                        <div className="col-span-2">
                            <div className=" relative ">
                                <input type="text" 
                                name="image_url"
                                value={input.image_url}
                                onChange={handleInput}
                                id="image_url" 
                                className=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                                placeholder="Image URL"
                                required/>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label className="text-gray-700" htmlFor="description">
                                <textarea className="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                                id="description" 
                                placeholder="Enter description" 
                                name="description" 
                                value={input.description}
                                onChange={handleInput}
                                rows="5" 
                                cols="40"
                                required>
                                </textarea>
                            </label>
                        </div>
                        <div className="col-span-2 pl-2">
                            <label htmlFor="default-toggle" className="inline-flex relative items-center cursor-pointer">
                                <input type="checkbox" 
                                value="1"
                                onChange={handleAvailable}
                                name="available"
                                id="default-toggle" 
                                className="sr-only peer"
                                checked={input.available == 1} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600" />
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Available</span>
                            </label>
                        </div>
                        {errorMessage !== null &&
                            <div className="col-span-2">
                                <p className="font-thin text-sm text-red-500">{errorMessage}</p>
                            </div>
                        }
                        <div className="col-span-2 text-right">
                            <button onClick={handleEdit}
                            className="py-2 px-4  bg-green-500 hover:bg-green-600 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={fetchEditStatus}>
                                {fetchEditStatus ? 'Loading...' : mode === 'edit' ? 'Edit' : 'Add'}
                            </button>
                            <button onClick={handleCancel}
                            className="mt-2 py-2 px-4  bg-red-500 hover:bg-red-600 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}