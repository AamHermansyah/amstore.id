import Link from "next/link";
import { formatRupiah } from "../utils";

export default function CardComponent({ data }){
    return (
        <li className="flex flex-row even:bg-gray-100">
            <div className="select-none flex flex-1 items-center p-4">
                <div className="flex-1 pl-1 mr-16">
                    <div className="text-xs sm:text-base font-medium dark:text-white">
                        {data.product.product_name}
                    </div>
                    <div className="text-gray-600 dark:text-gray-200 text-[0.7rem] sm:text-sm">
                        {data.quantity} unit
                    </div>
                </div>
                <div className="text-gray-600 dark:text-gray-200 text-[0.7rem] sm:text-xs">
                    Rp.{formatRupiah(data.unit_price)}
                </div>
                <Link href={`/detail-product/${data.product.id}`}>
                    <a className="w-24 text-right flex justify-end">
                        <svg fill="currentColor" className="w-3 sm:w-5 h-3 sm:h-5 hover:text-gray-800 dark:hover:text-white dark:text-gray-200 text-gray-500" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z">
                        </path>
                        </svg>
                    </a>
                </Link>
            </div>
        </li>
    )
}