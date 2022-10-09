import Image from "next/image";
import Link from "next/link";
import { formatRupiah, textTruncate } from '../utils/index';

export default function AdminCardProduct({onDelete, data, onEdit}){

    return (
        <>
            <div className="relative border border-gray-100 w-[300px] shadow-md">
                <div className="relative w-full ">
                    <Image
                        src={`/api/imageproxy?url=${encodeURIComponent(data.image_url)}`}
                        alt={data.product_name}
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

                    <button onClick={onEdit}
                    className="block w-full p-4 mt-2 text-sm font-medium text-center text-green-500 border-green-700 border-[1px] rounded-sm" type="button">
                        Edit
                    </button>
                    <button onClick={onDelete}
                    className="block w-full p-4 mt-2 text-sm font-medium text-center text-white bg-red-600 rounded-sm"
                    type="button">
                        Delete
                    </button>
                </div>
            </div>
        </>
    )
}