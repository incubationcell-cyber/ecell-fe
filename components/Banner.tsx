'use client';

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
  const marqueeSlides = [...bannerSlides, ...bannerSlides];

  return (
    <section id="home" className="relative w-full h-[72vh] min-h-[520px] pt-16 overflow-hidden bg-black">
      <div className="banner-marquee-track">
        {marqueeSlides.map((slide, index) => (
          <div key={`${slide.id}-${index}`} className="banner-marquee-item">
            <img src={slide.image} alt={slide.alt} className="h-full w-auto object-contain" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}
