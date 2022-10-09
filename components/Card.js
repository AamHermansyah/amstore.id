import Link from "next/link"
import Image from "next/image"
import { formatRupiah, textTruncate } from "../utils"
import { useContext, useState } from "react"
import { GlobalContext } from "../context/GlobalContextProvider"
import { useRouter } from "next/router"
import Quantity from "./Quantity"
import axios from "axios"
import Cookies from "js-cookie"

export default function Card({data}){
    const {state} = useContext(GlobalContext);
    const { userCookie, setFetchStatusProducts, setFetchTotalCheckoutStatus } = state;
    const router = useRouter();

    const [fetchAddToCartStatus, setFetchAddToCartStatus] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = async (event) => {
        !userCookie && router.push('/auth/user-login');

        const idProduct = event.target.value;

        if(userCookie){
            setFetchAddToCartStatus(prevBool => !prevBool);
            
            try {
                const result = await axios.post(`https://service-example.sanbercloud.com/api/checkout/${userCookie.id}/${idProduct}`, { quantity }, {
                    headers: { "Authorization": "Bearer " + Cookies.get("token_user") }
                });
            } catch (error) {
                alert(error)
            }

            setFetchStatusProducts(true);
            setFetchAddToCartStatus(prevBool => !prevBool);
            setFetchTotalCheckoutStatus(prevBool => !prevBool);
        }
    }

    return (
        <div className="relative border border-gray-100 w-[300px]">
          <div className="relative w-full ">
              <Image
                  src={`/api/imageproxy?url=${encodeURIComponent(data.image_url)}`}
                  alt="Flowbite Logo"
                  height={200}
                  width={300}
                  objectFit="cover"
              />
          </div>
          <div className="p-6">
              <small>
                  <span className="bg-sky-100 text-sky-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-r-lg dark:bg-sky-200 dark:text-green-900">{data.category.category_name}</span>
              </small>
              <h5 className="mt-4 ">
                  {textTruncate(data.product_name)}
              </h5>
              <ul className="mt-5 text-sm font-thin text-gray-500 ">
                  <li>Stock : {data.stock}</li>
                  <li className="text-lg font-bold">Harga : Rp.{formatRupiah(data.price)}</li>
              </ul>
              <Quantity stock={data.stock} setQuantity={quant => setQuantity(quant)} /> 
              <button type="button"
              className="block w-full p-4 mt-5 text-sm font-medium text-white bg-green-700 border rounded-sm disabled:bg-green-300 disabled:cursor-not-allowed"
              value={data.id}
              onClick={handleAddToCart}
              disabled={fetchAddToCartStatus}>
                  {fetchAddToCartStatus ?
                        "Loading..." : "Add to Cart"
                    }
              </button>

              <Link href={`/detail-product/${data.id}`}>
                  <a className="block w-full p-4 mt-2 text-sm font-medium text-center text-green-700 bg-white border border-green-700 rounded-sm" type="button">
                      Detail Product
                  </a>
              </Link>
          </div>
      </div>
    )
}