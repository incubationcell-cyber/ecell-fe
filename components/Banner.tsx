'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const bannerSlides = [
  { id: 1, image: '/Banner1.jpeg', alt: 'E-Cell banner 1' },
  { id: 2, image: '/Banner2.jpeg', alt: 'E-Cell banner 2' },
  { id: 3, image: '/Banner3.jpeg', alt: 'E-Cell banner 3' },
  { id: 4, image: '/Banner4.jpeg', alt: 'E-Cell banner 4' },
  { id: 5, image: '/Banner5.jpeg', alt: 'E-Cell banner 5' },
  { id: 6, image: '/Banner6.jpeg', alt: 'E-Cell banner 6' },
  { id: 7, image: '/Banner7.jpeg', alt: 'E-Cell banner 7' },
  { id: 8, image: '/Banner8.jpeg', alt: 'E-Cell banner 8' },
  { id: 9, image: '/Banner9.jpeg', alt: 'E-Cell banner 9' },
];

export default function Banner() {
  return (
    <section id="home" className="relative w-full h-[72vh] min-h-[520px] pt-16 overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        className="w-full h-full"
      >
        {bannerSlides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative !flex items-center justify-center">
            <div className="absolute inset-0 bg-black/20" />
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={slide.id === 1}
              sizes="100vw"
              className="object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
