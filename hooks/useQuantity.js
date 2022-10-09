import { useState } from "react";

export default function useQuantity(stock){
    const [quantity, setQuantity] = useState(1);

    const handleQuantity = (type) => {
        if(quantity >= 1 && quantity <= stock) {
            type === 'increment' && quantity < stock && setQuantity(prevNum => prevNum + 1);
            type === 'decrement' && quantity > 1 && setQuantity(prevNum => prevNum - 1);
        }
    }

    return [quantity, handleQuantity];
}