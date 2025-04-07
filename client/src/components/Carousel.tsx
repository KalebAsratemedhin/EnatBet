import React from 'react';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type Slide = {
  image: string;
  title: string;
};

const slides: Slide[] = [
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

// Custom arrow components with TypeScript
const NextArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
    aria-label="Next slide"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  </button>
);

const PrevArrow: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
    aria-label="Previous slide"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  </button>
);

const Carousel: React.FC = () => {
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    pauseOnHover: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <ul className="flex space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <button className="h-2 w-2 rounded-full bg-white/50 hover:bg-white/75 transition-colors duration-200">
        <span className="sr-only">Go to slide {i + 1}</span>
      </button>
    )
  };

  return (
    <div className="w-full relative">
      <Slider {...settings} className="h-[800px]">
        {slides.map((slide, index) => (
          <div key={index} className="relative w-full h-[800px]">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h2 className="text-white text-3xl font-bold px-4 text-center">
                {slide.title}
              </h2>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;