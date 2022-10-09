import { Carousel } from "flowbite-react";
import Image from "next/image";
import slide1 from '../public/images/banner1.png';
import slide2 from '../public/images/banner2.png';

export default function Banner() {
    return (
        <Carousel>
            <div className="relative h-64">
                <Image src={slide1} alt="slide1" objectFit="contain" layout="fill" priority />
            </div>
            <div className="relative h-64">
                <Image src={slide2} alt="slide2" objectFit="contain" layout="fill" priority />
            </div>
        </Carousel>
    )
}