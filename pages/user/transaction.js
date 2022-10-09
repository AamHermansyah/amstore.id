import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/GlobalContextProvider";
import { formatRupiah } from "../../utils";
import Layout from "../../widget/Layout";

export default function Transaction(){
    const { state } = useContext(GlobalContext);
    const { userCookie } = state;

    const [dataTransaction, setDataTransaction] = useState([]);
    const [dataTransactionSuccess, setDataTransactionSuccess] = useState([]);
    const [fetchStatusTransaction, setFetchStatusTransaction] = useState(true);

    useEffect(() => {
        if(fetchStatusTransaction && userCookie !== undefined){
            (async () => {
                try {
                    const res = await axios.get(`https://service-example.sanbercloud.com/api/transaction-user/${userCookie.id}`, {
                        headers: { "Authorization": "Bearer " + Cookies.get("token_user") }
                    });
    
                    setDataTransaction(res.data.filter(res => res.status !== "Transaksi selesai"));
                    setDataTransactionSuccess(res.data.filter(res => res.status === "Transaksi selesai"));
                } catch (error) {
                    alert(error)
                }
                setFetchStatusTransaction(prevBool => !prevBool);
            })();
        }
    }, [fetchStatusTransaction, userCookie])

    const handleTransactionIsDone = async (event) => {
        const idTransaction = event.target.value;

        try {
            const res = await axios.post(`https://service-example.sanbercloud.com/api/transaction-completed/${idTransaction}/${userCookie.id}`, {}, {
                headers: { "Authorization": "Bearer " + Cookies.get("token_user") }
            });

            res.status === 200 && setFetchStatusTransaction(prevBool => !prevBool);
        } catch (error) {
            alert(error)
        }
    }

    const handleTransactionDelete = async (event) => {
        const idTransaction = event.target.value;

        try {
            const res = await axios.delete(`https://service-example.sanbercloud.com/api/transaction/${idTransaction}`, {
                headers: { "Authorization": "Bearer " + Cookies.get("token_user") }
            });

            res.status === 200 && setFetchStatusTransaction(prevBool => !prevBool);
        } catch (error) {
            alert(error)
        }
    }

    return (
        <Layout>
            <section id="user-transaction" className="container -mt-16 mx-auto py-16 max-w-[900px]">
                <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="bg-green-500 px-4 py-5 sm:px-6 border-b w-full">
                            <h3 className="text-lg leading-6 font-medium text-white">
                                Your transaction
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-200">
                                Please complete the transaction
                            </p>
                        </div>
                        <p className="text-gray-500 mt-10">Transaksi terdaftar</p>
                        <ul className="w-full flex flex-col divide divide-y">
                            {dataTransaction.length > 0 ?
                                dataTransaction
                                .map(data => (
                                    <li key={data.id} className="flex flex-row even:bg-gray-100">
                                        <div className="select-none flex flex-1 items-center p-4">
                                            <div className="flex-1 pl-1 mr-16">
                                                <div className="text-xs sm:text-base font-medium dark:text-white">
                                                    {data.user.name}
                                                </div>
                                                <div className="text-xs sm:text-base font-medium dark:text-white">
                                                    Rp.{formatRupiah(data.total)}
                                                </div>
                                                <div className="text-gray-600 dark:text-gray-200 text-[0.7rem] sm:text-sm">
                                                    {data.transaction_code}
                                                </div>
                                            </div>
                                            <div className="text-gray-600 dark:text-gray-200 text-[0.7rem] sm:text-xs">
                                                {data.status}
                                            </div>
                                            <div className="flex flex-col gap-2 ml-4 md:ml-8">
                                                <button value={data.id}
                                                    onClick={handleTransactionIsDone}
                                                    className="text-[0.7rem] sm:text-xs font-thin sm:font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-lg px-2 sm:px-5 py-2.5 mr-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={fetchStatusTransaction}>
                                                        Transaction Done
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                )) :
                                <div>
                                    <h3 className="text-lg py-4 leading-6 font-medium text-gray-900 dark:text-white">
                                        Your transaction is empty, take add your favor product and let{"'"}s checkout.
                                    </h3>
                                </div>
                            }
                        </ul>
                        <p className="text-gray-500 mt-16">Transaksi selesai</p>
                        <ul className="w-full flex flex-col divide divide-y">
                            {dataTransactionSuccess.length > 0 ?
                                dataTransactionSuccess
                                .map(data => (
                                    <li key={data.id} className="flex flex-row even:bg-gray-100">
                                        <div className="select-none flex flex-1 items-center p-4">
                                            <div className="flex-1 pl-1 mr-16">
                                                <div className="text-xs sm:text-base font-medium dark:text-white">
                                                    {data.user.name}
                                                </div>
                                                <div className="text-xs sm:text-base font-medium dark:text-white">
                                                    Rp.{formatRupiah(data.total)}
                                                </div>
                                                <div className="text-gray-600 dark:text-gray-200 text-[0.7rem] sm:text-sm">
                                                    {data.transaction_code}
                                                </div>
                                            </div>
                                            <div className="text-gray-600 dark:text-gray-200 text-[0.7rem] sm:text-xs">
                                                {data.status}
                                            </div>
                                            <div className="flex flex-col gap-2 ml-4 md:ml-8">
                                                <button value={data.id}
                                                className="text-[0.7rem] font-thin sm:font-medium sm:text-xs text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-gray-300 rounded-lg px-2 sm:px-5 py-2.5 mr-2 dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-red-600 dark:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={fetchStatusTransaction}
                                                onClick={handleTransactionDelete}>
                                                    Remove Transaction
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                )) :
                                <div>
                                    <h3 className="text-lg py-4 leading-6 font-medium text-gray-900 dark:text-white">
                                        Your transaction completed is empty.
                                    </h3>
                                    <div className="h-[7vh]" />
                                </div>
                            }
                        </ul>
                    </div>
            </section>
        </Layout>
    )
}