'use client';

import { Dialog, DialogContent } from "@radix-ui/react-dialog";
const defaultGalleryImages = [
  {
    id: 1,
    title: 'Startup Pitch Event',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
    category: 'Events',
  },
  {
    id: 2,
    title: 'Workshop Session',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
    category: 'Workshop',
  },
  {
    id: 3,
    title: 'Team Collaboration',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
    category: 'Team',
  },
  {
    id: 4,
    title: 'Networking Event',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
    category: 'Networking',
  },
  {
    id: 5,
    title: 'Award Ceremony',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
    category: 'Awards',
  },
  {
    id: 6,
    title: 'Mentorship Program',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
    category: 'Mentorship',
  },
];

type GalleryImage = {
  id: number;
  title: string;
  image: string;
  category: string;
};

type GalleryProps = {
  images?: GalleryImage[];
};

export default function Gallery({ images = defaultGalleryImages }: GalleryProps) {
  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Gallery
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Moments from our events and activities
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg cursor-pointer aspect-square"
            >
              <img
                src={image.image || "/placeholder.svg"}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-lg font-semibold">{image.title}</h3>
                  <p className="text-sm text-white/80">{image.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
