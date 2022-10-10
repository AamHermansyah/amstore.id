import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Layout from "../../widget/Layout";
import Image from 'next/image';
import { formatRupiah } from "../../utils";
import Quantity from "../../components/Quantity";
import { GlobalContext } from "../../context/GlobalContextProvider";
import { useContext } from "react";
import Cookies from "js-cookie";

export default function DetailDataProduct(){
    const {state} = useContext(GlobalContext);
    const { userCookie, setFetchStatusProducts, setFetchTotalCheckoutStatus } = state;
    const router = useRouter();
    const { id } = router.query;

    const [dataProduct, setDataProduct] = useState(null);
    const [fetchAddToCartStatus, setFetchAddToCartStatus] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const handleFetchData = () => {
        axios.get(`https://service-example.sanbercloud.com/api/product/${id}`)
        .then(res => {
            if(res.request.status === 200){
                setDataProduct(res.data);
            }
        })
        .catch(err => {
            alert(err)
        })
    }

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

    useEffect(() => {
        if(router.isReady){
            handleFetchData();
        }
    }, [router.isReady]);

    return (
        <Layout>
            <div className="container -mt-16 mx-auto py-16">
                <div>
                    <h1 className="font-bold text-[1.5rem] mb-6">Detail Product</h1>
                </div>
                {dataProduct !== null ?
                    <div className="border">
                        <div className="flex flex-col md:flex-row md:items-center bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="relative md:flex-1 lg:flex-[0.5] w-full aspect-video md:aspect-square">
                                <Image
                                    src={`/api/imageproxy?url=${encodeURIComponent(dataProduct.image_url)}`}
                                    alt="Flowbite Logo"
                                    objectFit="cover"
                                    layout="fill"
                                />
                            </div>
                            <div className="flex-1 p-4">
                                <h1 className="text-gray-900 font-bold text-2xl">
                                    { dataProduct.product_name }
                                </h1>
                                <p className="mt-2 text-gray-600 text-sm">
                                    { dataProduct.description }
                                </p>
                                <div className="flex item-center mt-2">
                                    <p className="mt-2 text-gray-600 text-sm">
                                        Stock : { dataProduct.stock }
                                    </p>
                                </div>
                                <div className="flex flex-col item-center justify-between mt-3 gap-4">
                                    <h1 className="text-gray-700 font-bold text-xl">
                                        Rp.{formatRupiah(dataProduct.price)}
                                    </h1>
                                    <Quantity stock={ dataProduct.stock } setQuantity={quant => setQuantity(quant)} />
                                    <button value={dataProduct.id} className="px-4 py-2 w-full sm:w-[300px] mx-auto bg-gray-800 text-white text-xs font-bold uppercase rounded disabled:bg-gray-500 disabled:cursor-not-allowed" onClick={handleAddToCart} disabled={fetchAddToCartStatus}>
                                        {fetchAddToCartStatus ?
                                            "Loading..." : "Add To Cart"
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div> :
                    <h1 className="font-semibold text-[1rem]">{"Data not found:("}</h1>
                }
            </div>
        </Layout>
    )
}
