import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
  {
    image: 'http://localhost:3000/Delicious Salami Pizza🍕.jpeg',
    title: 'Delicious Pizza at Your Doorstep',
  },
  {
    image: 'http://localhost:3000/crack burgers -.jpeg',
    title: 'Mouthwatering Burgers in Minutes',
  },
  {
    image: 'http://localhost:3000/Yetsom Beyaynetu (Ethiopian Combination Platter).jpeg',
    title: 'Delicious Beyaynet for you and your friends',
  },
];

const Carousel: React.FC = () => {
  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="h-[800px]"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-[800px]">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <h2 className="text-white text-3xl font-bold">{slide.title}</h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
