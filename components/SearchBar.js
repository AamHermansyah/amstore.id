import axios from "axios";
import { useRouter } from "next/router";
import { useRef, useState } from "react"
import { debounce, textTruncate } from "../utils";

export default function SearchBar(){
    const [displaySearch, setDisplaySearch] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const inputSearchRef = useRef(null);

    const router = useRouter();

    const handleSearch = (event) => {
        if(event.target.value !== ""){
            (debounce(() => {
                axios.get(`https://service-example.sanbercloud.com/api/product`)
                    .then(res => {
                        let data = res.data
                            .filter(searchData => searchData.available > 0 && Object.values(searchData)
                            .join("")
                            .toLowerCase()
                            .includes(event.target.value));
                        setSearchData(data);
                    })
                    .catch(err => {
                        alert(err)
                    })
            }, 1000))();
            setDisplaySearch(true);
        } else setDisplaySearch(false);
    }

    const handleClearSearch = () => {
        setDisplaySearch(false);
        setSearchData([]);
        inputSearchRef.current.value = "";
        inputSearchRef.current.focus();
    }

    return (
        <form className="flex sm:w-[400px] lg:w-[600px] items-center relative z-10">
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                </div>
                <input type="text" 
                id="simple-search" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" 
                placeholder="Search" 
                required
                ref={inputSearchRef}
                onChange={handleSearch} />
            </div>
            {displaySearch && 
                <div className="absolute max-h-[91vh] top-[102%] left-0 bg-white w-full flex flex-col p-5 text-slate-700 text-[.9rem] font-thin shadow-md">
                    <div className="cursor-pointer w-max self-end" onClick={handleClearSearch}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    {searchData.length > 0 && searchData.map(data => (
                        <span className="border-b-[1px] border-gray-400 pt-2 pb-1 cursor-pointer" 
                        key={data.id}
                        onClick={() => router.push(`/detail-product/${data.id}`)}>
                            {textTruncate(data.product_name, 50)}
                        </span>
                    ))
                    }
                </div>
            }
        </form>
    )
}