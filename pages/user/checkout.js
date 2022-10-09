import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import CardComponent from "../../components/CardCheckout";
import { GlobalContext } from "../../context/GlobalContextProvider";
import Layout from "../../widget/Layout";
import emailjs from "@emailjs/browser";
import { removeBrTagHtml, sumNumberInArr } from "../../utils";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Checkout(){
    const { state, handleFunction } = useContext(GlobalContext);
    const { totalCheckout } = state;
    const { handleTotalCheckout } = handleFunction;

    const [dataCheckout, setDataCheckout] = useState([]);
    const [totalPriceProducts, setTotalPriceProducts] = useState(0);
    const [fetchStatusTransaction, setFetchStatusTransaction] = useState(false);
    const [bank, setBank] = useState(null);
    const [bankId, setBankId] = useState(-1);
    const [input, setInput] = useState({
        textAreaMessage: ''
    });
    const [fetchMessageStatus, setFetchMessageStatus] = useState(true);

    const formRef = useRef();
    const router = useRouter();

    const handleSelectedBank = (event) => {
        setBankId(event.target.value);
    }

    const handleMessageCheckout = (products, totalPriceProducts) => {
        products = products.map(product => product.product.product_name)
        setInput({
            ...input,
            textAreaMessage: 'Your product for checkout :<br>\n-' + products.join('\n<br>-') + '<br><br>\n\nTotal price : Rp.' + totalPriceProducts
        })
    }

    const handleTransaction = (event) => {
        event.preventDefault();
        if(bankId === -1){
            alert("silahkan pilih bank yang tersedia");
        } else {
            setFetchStatusTransaction(prevBool => !prevBool);
            const { id } = JSON.parse(Cookies.get("user"));

            axios.post(`https://service-example.sanbercloud.com/api/transaction/${id}`, { id_bank: bankId }, {
                headers: { "Authorization": "Bearer " + Cookies.get("token_user") }
            })
            .then(async (res) => {
                if(res.status === 200){
                    try {
                        await emailjs.sendForm("service_veh0ta8", "template_qvp0n7d", formRef.current, "iJ2tu1srrHiu_Vzlq");
                    } catch (error) {
                        alert(error)
                    }
                }
                handleTotalCheckout();
                router.push('/user/transaction');
            })
            .catch(err => {
                alert(err)
            })
            .finally(() => {
                setFetchStatusTransaction(prevBool => !prevBool);
            })
        }
    }

    useEffect(() => {
        (async () => {
            const { id } = JSON.parse(Cookies.get("user"));
            try {
                if(fetchMessageStatus){
                    const resBank = await axios.get(`https://service-example.sanbercloud.com/api/bank`);
                    resBank.status === 200 && setBank(resBank.data);

                    const result = await axios.get(`https://service-example.sanbercloud.com/api/checkout-product-user/${id}`, {
                        headers: { "Authorization": "Bearer " + Cookies.get("token_user") }
                    });

                    const data = result.data.filter(data => data.is_transaction === 0);
                    
                    if(result.status === 200){
                        setDataCheckout(data);
                        const totalPrice = sumNumberInArr(data)
                        setTotalPriceProducts(totalPrice);
                        handleMessageCheckout(data, totalPrice);
                    }

                    setFetchMessageStatus(false);
                }
            } catch (error) {
                alert(error)
            }
        })()
    }, [handleMessageCheckout, fetchMessageStatus]);

    return (
        <Layout>
            <section id="checkout" className="container -mt-16 mx-auto py-16 max-w-[900px]">
                <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="bg-green-500 px-4 py-5 sm:px-6 border-b w-full">
                        <h3 className="text-lg leading-6 font-medium text-white">
                            Detail Product
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-200">
                            This is your cart. So, lets checkout your favor products!
                        </p>
                    </div>
                    <ul className="w-full flex flex-col divide divide-y">
                        {dataCheckout.length > 0 ?
                            dataCheckout.map(data => (
                                <CardComponent key={data.id} data={data} />
                            )) :
                            <h3 className="text-lg py-4 leading-6 font-medium text-gray-900 dark:text-white">
                                Your cart is empty, take your favor product and let{"'"}s checkout.
                            </h3>
                        }
                    </ul>
                </div>

                {dataCheckout.length > 0 ?
                    <form onSubmit={handleTransaction} ref={formRef} id="transaction-form" className="mt-4 md:mt-10">
                        <div className="p-5">
                            <label className="text-gray-700" htmlFor="animals">
                                Choose method for the transaction :
                                <select id="bank" 
                                className="block w-full mt-2 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" 
                                name="bank"
                                onChange={handleSelectedBank}>
                                    {bank !== null && bank.map(res => (
                                        <option key={res.id} value={res.id}>{res.bank_name}</option>
                                    ))}
                                </select>
                            </label>

                            <span className="text-gray-700 mt-4 block">Please complete your identity :</span>
                            <div className=" relative">
                                <input type="text" id="required-name" className="mt-2 rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" name="user_name" placeholder="Your name" required/>
                            </div>
                            <div className=" relative">
                                <input type="email" id="required-email" className="mt-2 rounded-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" name="user_email" placeholder="Your email" required/>
                            </div>

                            <label className="text-gray-700 mt-4 block" htmlFor="name">
                                Your products for checkout :
                                <textarea className="flex-1 mt-2 h-40 md:h-72 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" 
                                id="message_display" 
                                name="message_display"
                                defaultValue={removeBrTagHtml(input.textAreaMessage)}
                                readOnly>
                                </textarea>
                            </label>

                            <input type="hidden" value={input.textAreaMessage} id="message" name="message" />
                        </div>

                        <div className="flex justify-between items-center px-4 py-5 sm:mt-10 sm:px-6 border-b max-w-[900px] mx-auto">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    {totalCheckout} products in cart
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-700">
                                    Total: Rp.{totalPriceProducts}
                                </p>
                            </div>
                            <button
                            type="submit"
                            className="w-max mt-2 ml-3 cursor-pointer focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={fetchStatusTransaction}>
                                {fetchStatusTransaction ? "Loading..." : "Checkout"}
                            </button>
                        </div>
                    </form> :
                    <div className="h-[38vh]" />
                }
            </section>
        </Layout>
    )
}