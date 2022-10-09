import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import AlertDelete from "../../components/AlertDelete";
import LayoutAdmin from "../../widget/LayoutAdmin";

export default function Category(){
    const [dataCategory, setDataCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [paginationLimit, setPaginationLimit] = useState(5);
    const [paginationLoadingStatus, setPaginationLoadingStatus] = useState(false);
    const [displayAlert, setDisplayAlert] = useState(false);
    const [categoryIdDelete, setCategoryIdDelete] = useState(null);
    const [fetchAddAndEditStatus, setFetchAddAndEditStatus] = useState(false);

    const [modeInput, setModeInput] = useState('add');
    const [categoryIdEdit, setCategoryIdEdit] = useState(null);
    const inputRef = useRef(null);

    const handlePaginationButton = () => {
        setPaginationLoadingStatus(prevBool => !prevBool);
            setTimeout(() => {
                setPaginationLimit(prev => {
                    if(prev + paginationLimit > dataCategory.length + paginationLimit) return prev;
                    return prev + 5;
                });
                setPaginationLoadingStatus(prevBool => !prevBool);
        }, 2000)
    }

    const handleDelete = (id) => {
        setCategoryIdDelete(id);
        setDisplayAlert(true);
    }

    const handleCloseAlertDelete = (isSuccess) => {
        isSuccess === 'success' && setIsLoading(true);
        setCategoryIdDelete(null);
        setDisplayAlert(false);
    }

    const handleEditButton = (id, value) => {
        setCategoryIdEdit(id);
        inputRef.current.value = value;
        setModeInput('edit');
    }

    const handleAddAndEditFetch = async (event) => {
        event.preventDefault();
        if(inputRef.current.value === "") return alert('Input field cannot be empty');

        setFetchAddAndEditStatus(true);

        try {
            let result = await axios({
                method: modeInput === 'edit' ? 'put' : 'post',
                url: `https://service-example.sanbercloud.com/api/category${modeInput === 'edit' ? '/' + categoryIdEdit : ''}`,
                data: {category_name : inputRef.current.value},
                headers: { "Authorization": "Bearer " + Cookies.get("token_admin") }
            });
    
            modeInput === 'edit' && setModeInput('add');
    
            if(result?.status === 200 || result?.status === 201){
                inputRef.current.value = "";
                setIsLoading(true);
            } else alert(result.statusText);
            setFetchAddAndEditStatus(false);
        } catch (error) {
            alert(error);
            setFetchAddAndEditStatus(false);
        }
    }

    const handleCancelEdit = () => {
        inputRef.current.value = "";
        setModeInput('add');
    }

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`https://service-example.sanbercloud.com/api/category`);
                const data = await res.json();
                if(data){
                    setDataCategory(data);
                }
                setIsLoading(false);
            } catch (error) {
                alert(error);
                setIsLoading(false);
            }
        })();
    }, [isLoading]);

    return (
        <LayoutAdmin active="category">

            <AlertDelete 
            handleDelete={displayAlert} 
            id={categoryIdDelete} 
            typeDelete="category"
            onCancel={handleCloseAlertDelete}
            onSuccess={() => handleCloseAlertDelete('success')} />

            <section id="category" className="p-4 pt-24 md:pt-8 md:pl-[250px] lg:pl-[300px]">
                <div className="flex flex-col sm:flex-row justify-between sm:gap-4 sm:items-center">
                    <h1 className="font-semibold text-2xl mb-6 sm:mb-0">Category {`(${dataCategory.length})`}</h1>
                    <form className="flex flex-wrap gap-4" autoComplete="off" onSubmit={handleAddAndEditFetch}>
                        <div className="relative">
                            <input 
                            type="text" 
                            id="category" 
                            name="category_name" 
                            className=" rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" 
                            placeholder="Category name"
                            ref={inputRef} />
                        </div>
                        <button onClick={handleAddAndEditFetch}
                        disabled={fetchAddAndEditStatus}
                        className='w-max bg-green-500 text-white uppercase py-2 px-4 rounded-md transition-colors duration-200 justify-start dark:from-gray-700 dark:to-gray-800'>
                            <span className="text-sm font-normal disabled:opacity-50 disabled:cursor-not-allowed">
                                {modeInput === 'add' ? 'Add' : 'Edit'}
                            </span>
                        </button>
                        {modeInput === 'edit' &&
                            <button onClick={handleCancelEdit}
                            className='w-max bg-red-500 text-white uppercase py-2 px-4 rounded-md transition-colors duration-200 justify-start dark:from-gray-700 dark:to-gray-800'>
                                <span className="text-sm font-normal">Cancel</span>
                            </button>
                        }
                    </form>
                </div>
                <div className="container mx-auto px-4 sm:px-8 max-w-3xl">
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th scope="col" 
                                        className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Category</th>
                                        <th scope="col" 
                                        className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Id</th>
                                        <th scope="col" 
                                        className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Created at</th>
                                        <th scope="col" 
                                        className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataCategory.length > 0 && dataCategory
                                        .filter((data, index) => index < paginationLimit)
                                        .map(data => (
                                            <tr key={data.id}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                        {data.category_name}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.id}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.created_at}</p>
                                                </td>
                                                <td className="flex gap-2 px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <button type="button"
                                                    className="py-1 px-4 flex justify-center items-center  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-[.7rem] shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                                                    onClick={() => handleEditButton(data.id, data.category_name)}>
                                                        Edit
                                                    </button>
                                                    <button type="button"
                                                    className="py-1 px-4 flex justify-center items-center  bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-[.7rem] shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
                                                    onClick={() => handleDelete(data.id)}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            <div className="flex justify-center">
                                <button type="button"
                                className={`py-2.5 mt-10 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-slate-100 rounded-lg border border-gray-300 hover:bg-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                                disabled={paginationLoadingStatus}
                                onClick={handlePaginationButton}>
                                {paginationLoadingStatus ? 'Loading...' : 'Load more'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </LayoutAdmin>
    )
}