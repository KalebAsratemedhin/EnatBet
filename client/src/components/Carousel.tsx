import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"

const slides = [
  {
    image: `/Delicious Salami Pizza🍕.jpeg`,
    title: 'Delicious Pizza at Your Doorstep',
  },
  {
    image: `/crack burgers -.jpeg`,
    title: 'Mouthwatering Burgers in Minutes',
  },
  {
    image: `/Yetsom Beyaynetu (Ethiopian Combination Platter).jpeg`,
    title: 'Delicious Beyaynet for you and your friends',
  },
];

const CustomCarousel: React.FC = () => {
  return (
    <div className="w-full relative">
      <Carousel
        opts={{
          loop: true,
          align: 'center',
        }}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-[800px] relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h2 className="text-white text-3xl font-bold text-center px-4">
                  {slide.title}
                </h2>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
    </div>
  );
};

export default CustomCarousel;
