import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useState } from "react";
import { sumNumberInArr } from "../utils";

export const GlobalContext = createContext();

export default function GlobalContextProvider({children}){
    const [userCookie, setUserCookie] = useState(undefined);
    const [totalCheckout, setTotalCheckout] = useState(0);
    const [dataCheckout, setDataCheckout] = useState([]);

    // indikator
    const [fetchStatusProducts, setFetchStatusProducts] = useState(true);
    const [fetchTotalCheckoutStatus, setFetchTotalCheckoutStatus] = useState(true);

    // handle function
    const handleTotalCheckout = async () => {

        try {
            const result = await axios.get(`https://service-example.sanbercloud.com/api/checkout-product-user/${userCookie.id}`, {
                headers: { "Authorization": "Bearer " + Cookies.get("token_user") }
            });

            const data = result.data.filter(data => data.is_transaction === 0);
            
            if(result.status === 200){
                setDataCheckout(data);
                setTotalCheckout(data.length);
            }

        } catch (error) {
            alert(error)
        }
    }

    const state = {
        userCookie,
        setUserCookie,
        fetchStatusProducts,
        setFetchStatusProducts,
        fetchTotalCheckoutStatus,
        setFetchTotalCheckoutStatus,
        totalCheckout,
        dataCheckout
    }

    const handleFunction = {
        handleTotalCheckout
    }

    return (
        <GlobalContext.Provider value={{state, handleFunction}}>
            {children}
        </GlobalContext.Provider>
    )
}