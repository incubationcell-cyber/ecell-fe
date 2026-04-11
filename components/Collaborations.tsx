'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Card } from './ui/card';

const defaultCollaborations = [
  {
    id: 1,
    organization: 'TechStart India',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    description: 'Collaborated on Summer Innovation Bootcamp. Mentored 50+ students in startup fundamentals.',
    events: '2 events co-hosted',
  },
  {
    id: 2,
    organization: 'Innovation Hub Jaipur',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    description: 'Partnership for business incubation and accelerator programs for early-stage startups.',
    events: '5 events co-hosted',
  },
  {
    id: 3,
    organization: 'Digital India Foundation',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    description: 'Joint initiatives for digital literacy and tech entrepreneurship awareness campaigns.',
    events: '3 events co-hosted',
  },
  {
    id: 4,
    organization: 'StartUp Quest',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
    description: 'Collaboration on startup competitions and networking events throughout the year.',
    events: '4 events co-hosted',
  },
];

type CollaborationItem = {
  id: string | number;
  organization: string;
  image: string;
  description: string;
  events: string;
};

type CollaborationsProps = {
  collaborations?: CollaborationItem[];
};

export default function Collaborations({
  collaborations = defaultCollaborations,
}: CollaborationsProps) {
  const hasCollaborations = collaborations.length > 0;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Our Collaborations
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Partnerships with leading organizations to create exceptional opportunities
          </p>
        </div>

        {hasCollaborations ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
            }}
            className="collaborations-swiper"
          >
            {collaborations.map((collab) => (
              <SwiperSlide key={collab.id}>
                <Card className="overflow-hidden border border-border h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    {/* Left: Image */}
                    <div className="relative h-64 md:h-auto overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                      <img
                        src={collab.image || "/placeholder.svg"}
                        alt={collab.organization}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Right: Content */}
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-3">
                          {collab.organization}
                        </h3>
                        <p className="text-muted-foreground mb-4">{collab.description}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {collab.events}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Card className="p-8 text-center border border-border">
            <p className="text-muted-foreground">No collaborations available right now. Please check back soon.</p>
          </Card>
        )}
      </div>
    </section>
  );
}
