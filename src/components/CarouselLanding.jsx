import * as React from "react";
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselDemo({ photos }) {
  return (
    <Carousel className="w-full max-w-7xl h-full bg-slate-600 relative">
      <CarouselContent className="flex">
        {photos.map((photo, index) => (
          <CarouselItem key={index} className="flex-shrink-0 basis-full lg:basis-full">
            <div className="">
              <Card className="">
                <CardContent className="relative aspect-square items-center justify-center p-6">
                  <Image
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="carousel-arrow left-2" />
      <CarouselNext className="carousel-arrow right-2" />
    </Carousel>
  );
}
