import { useEffect, useState } from "react";
import AdminCardProduct from "../../components/AdminCardProduct";
import AlertDelete from "../../components/AlertDelete";
import AddAndEditProduct from "../../components/AddAndEditProduct";
import CardSkeleton from "../../widget/CardSkeleton";
import LayoutAdmin from "../../widget/LayoutAdmin";

export default function Dashboard(){
    const [dataProducts, setDataProducts] = useState([]);
    const [dataProductEdit, setDataProductEdit] = useState(null);
    const [productIdDelete, setProductIdDelete] = useState(null);

    const [limitPagination, setLimitPagination] = useState(5);
    const [paginationFetchStatus, setPaginationFetchStatus] = useState(true);
    const [isLastPagination, setIsLastPagination] = useState(false);

    const [inputSearch, setInputSearch] = useState('');

    const [displayAlert, setDisplayAlert] = useState(false);
    const [addAndEditToggleDisplay, setAddAndEditToggleDisplay] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const handlePaginationButton = () => {
        setPaginationFetchStatus(prevBool => !prevBool);
            setTimeout(() => {
                setLimitPagination(prev => {
                    if(prev + 5 > dataProducts.length) return prev;
                    return prev + 5;
                });
                setPaginationFetchStatus(prevBool => !prevBool);
            }, 2000)
    }

    const handleDelete = (id) => {
        setDisplayAlert(true)
        setProductIdDelete(id)
    }

    const handleCloseAlertDelete = (isSuccess) => {
        isSuccess === 'success' && setIsLoadingData(true);
        setProductIdDelete(null);
        setDisplayAlert(false);
    }

    const handleAddOrEditProduct = (product) => {
        setAddAndEditToggleDisplay(true);
        setDataProductEdit(product ? product : null);
    }

    const handleSearch = (event) => {
        setInputSearch(event.target.value);
        setLimitPagination(5);
    }

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`https://service-example.sanbercloud.com/api/product`);
                const data = await res.json();
                if(data){
                    setDataProducts(data);
                }
                setPaginationFetchStatus(false);
                setIsLoadingData(false);
            } catch (error) {
                setPaginationFetchStatus(false);
                setIsLoadingData(false);
                alert(error);
            }
        })();
    }, [isLoadingData]);

    return (
        <LayoutAdmin active="dashboard">

            <AlertDelete 
            handleDelete={displayAlert} 
            id={productIdDelete} 
            typeDelete="product"
            onCancel={handleCloseAlertDelete}
            onSuccess={() => handleCloseAlertDelete('success')} />

            <AddAndEditProduct 
            isDisplay={addAndEditToggleDisplay} 
            onCancel={() => setAddAndEditToggleDisplay(false)}
            data={dataProductEdit} 
            onSuccess={() => setIsLoadingData(true)}
            />

            <section id="dashboard" className="p-4 pt-24 md:pt-4 md:pl-[250px] lg:pl-[300px]">
                <div className="flex flex-col sm:flex-row justify-between sm:gap-4">
                    <form className="flex sm:w-[400px] lg:w-[700px] items-center relative z-10" 
                    onSubmit={event => event.preventDefault()}>
                        <label htmlFor="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                            </div>
                            <input type="text" 
                            id="simple-search" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" 
                            placeholder="Search" 
                            onChange={handleSearch}
                            />
                        </div>
                    </form>
                    <button onClick={() => handleAddOrEditProduct()}
                    className='w-max bg-green-500 text-white first-letter:w-full font-bold uppercase flex items-center p-2 sm:p-4 my-2 rounded-full transition-colors duration-200 justify-start mt-6 sm:mt-0 dark:from-gray-700 dark:to-gray-800'>
                        <span className="text-left">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        </span>
                        <span className="mx-4 text-sm font-normal">
                            Add
                        </span>
                    </button>
                </div>
                <h1 className="font-semibold text-2xl mb-6">All Products {`(${dataProducts.length})`}</h1>
                <div className="flex flex-wrap justify-center gap-4">
                    {(dataProducts.length > 0 && !isLoadingData) ? dataProducts
                        .filter((product, index) => {
                            if(inputSearch !== ""){
                                const regex = new RegExp(`(${inputSearch})`, 'gi');
                                return regex.test(product.product_name);
                            } else return true;
                        })
                        .filter((product, index) => index < limitPagination)
                        .map(product => (
                            <AdminCardProduct key={product.id}
                            onDelete={() => handleDelete(product.id)} 
                            onEdit={() => handleAddOrEditProduct(product)}
                            data={product} />
                        )) :
                        <CardSkeleton />
                    }
                </div>

                { paginationFetchStatus && !isLoadingData ?
                    <CardSkeleton /> :
                    <div className="flex justify-center">
                        <button type="button"
                        className={`${isLastPagination ? 'hidden' : ''} py-2.5 mt-10 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-slate-100 rounded-lg border border-gray-300 hover:bg-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700`}
                        onClick={handlePaginationButton}>
                        Load more
                        </button>
                    </div>
                }    
            </section>
        </LayoutAdmin>
    )
}
