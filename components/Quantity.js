import { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContextProvider";
import useQuantity from "../hooks/useQuantity";

export default function Quantity({ stock, setQuantity }){
    const [quantity, handleQuantity] = useQuantity(stock);
    const {state: { userCookie }} = useContext(GlobalContext);

    return (
        <>
            {userCookie !== undefined &&
                <div className="flex items-center justify-between mt-4 border w-full mx-auto">
                    <button className="h-full px-2 text-black bg-gray-200" onClick={() => handleQuantity('decrement')}>-</button>
                    <input className="inline-block w-full h-full text-center focus:outline-none" 
                    value={quantity} 
                    onChange={_ => null} />
                    <button className="h-full px-2 text-black bg-gray-200" onClick={() => handleQuantity('increment')}>+</button>
                </div>
              }
        </>
    )
}