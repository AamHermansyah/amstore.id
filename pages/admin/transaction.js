import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import LayoutAdmin from "../../widget/LayoutAdmin";
import { formatRupiah } from '../../utils';

export default function Transaction(){
    const [dataTransaction, setDataTransaction] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [paginationLimit, setPaginationLimit] = useState(5);
    const [paginationLoadingStatus, setPaginationLoadingStatus] = useState(false);
    const [isLastPagination, setIsLastPagination] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const result = await axios.get(`https://service-example.sanbercloud.com/api/transaction`, {
                    headers: { "Authorization": "Bearer " + Cookies.get("token_admin") }
                });

                if(result.status === 200){
                    setDataTransaction(result.data);
                } else alert(result.statusText);
                setIsLoading(false);
            } catch (error) {
                alert(error);
                setIsLoading(false);
            }
        })();
    }, []);

    const handlePaginationButton = () => {
        setPaginationLoadingStatus(prevBool => !prevBool);
            setTimeout(() => {
                setPaginationLimit(prev => {
                    prev + 5 >= dataTransaction.length && setIsLastPagination(true);
                    return prev + 5;
                });
                setPaginationLoadingStatus(prevBool => !prevBool);
        }, 2000)
    }

    return (
         <LayoutAdmin active="transaction">
            <section id="transaction" className="p-4 pt-24 md:pt-8 md:pl-[250px] lg:pl-[300px]">
                <h1 className="font-semibold text-2xl mb-6 sm:mb-0">Total {`(${dataTransaction.length})`} Transactions</h1>
                <div className="container mx-auto px-4 sm:px-8 max-w-3xl">
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th scope="col" 
                                        className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">User</th>
                                        <th scope="col" 
                                        className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Email</th>
                                        <th scope="col" 
                                        className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Bank</th>
                                        <th scope="col" 
                                        className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Created at</th>
                                        <th scope="col" 
                                        className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Total {`(Rp)`}</th>
                                        <th scope="col" 
                                        className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataTransaction.length > 0 && dataTransaction
                                        .filter((data, index) => index < paginationLimit)
                                        .map(data => (
                                            <tr key={data.id}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                        {data.user.name}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                        {data.user.email}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">
                                                        {data.bank.bank_name + ` (${data.bank.virtual_account})`}
                                                    </p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.created_at}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{formatRupiah(data.total)}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{data.status}</p>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            <div className="flex justify-center">
                                {isLoading && <p className="text-2xl font-semibold">Data is Loading...</p>}
                                <button type="button"
                                className={`${isLastPagination ? 'hidden' : ''} py-2.5 mt-10 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-slate-100 rounded-lg border border-gray-300 hover:bg-gray-200 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
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
