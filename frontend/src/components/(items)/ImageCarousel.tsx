"use client";

import {useState, useEffect} from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import Image from "next/image"
export default function ImageCarousel({images} : {images: string[]}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="mx-auto max-w-md">
      <Carousel setApi={setApi} className="w-full max-w-md ">
        <CarouselContent>
          {images.length > 0 ?
          images.map((url) => (
            <CarouselItem key={url} className="flex aspect-square items-center justify-center p-6">
              <Image src={url} alt="Product" width={1000} height={1000} />
            </CarouselItem>
          )) : 
            <CarouselItem className="flex aspect-square items-center justify-center p-6">
              <Image src="/placeholder.png" alt="Product" width={1000} height={1000} />
            </CarouselItem>
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground dark:text-white ml-4">
        Image {current} of {count}
      </div>
    </div>
  )
}
