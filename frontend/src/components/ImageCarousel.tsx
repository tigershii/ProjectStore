import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

export default function ImageCarousel() {
    return (
        <Carousel>
            <CarouselContent>
                {[...Array(10)].map((i) => (
                    <CarouselItem key={i}>
                        <Image src="/moon.svg" alt="moon" width={100} height={100} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious/>
            <CarouselNext/>
        </Carousel>
    )
}