'use client';

import Image from 'next/image';
import { Card } from './ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';

const defaultEvents = [
  {
    id: 1,
    title: 'Startup Bootcamp 2024',
    date: 'March 15-20, 2024',
    time: '10:00 AM - 5:00 PM',
    location: 'JEC Campus',
    description: 'Intensive bootcamp for aspiring founders to learn the fundamentals of building startups.',
    category: 'Workshop',
  },
  {
    id: 2,
    title: 'Pitch Perfect',
    date: 'April 5, 2024',
    time: '2:00 PM - 4:00 PM',
    location: 'Auditorium',
    description: 'Showcase your innovative ideas and pitch to potential investors and mentors.',
    category: 'Competition',
  },
  {
    id: 3,
    title: 'Entrepreneur Talk Series',
    date: 'April 12, 2024',
    time: '3:00 PM - 4:30 PM',
    location: 'Conference Hall',
    description: 'Inspiring stories from successful entrepreneurs and industry leaders.',
    category: 'Talk',
  },
];

type EventItem = {
  id: string | number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: string;
  image?: string;
  speaker?: string;
};

type UpcomingEventsProps = {
  events?: EventItem[];
  successfulEvents?: EventItem[];
};

export default function UpcomingEvents({
  events = defaultEvents,
  successfulEvents = [],
}: UpcomingEventsProps) {
  const hasSuccessfulEvents = successfulEvents.length > 0;

  return (
    <section id="events" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Upcoming Events
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our exciting events and be part of the entrepreneurial journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden border border-border hover:shadow-lg transition-shadow">
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center"
                  />
                ) : null}
              </div>
              <div className="p-6 space-y-3">
                <div className="inline-flex bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full w-fit">
                  {event.category}
                </div>
                <h3 className="text-xl font-bold text-foreground">{event.title}</h3>
                <p className="text-muted-foreground">
                  Speaker: {event.speaker || event.description || 'TBA'}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {hasSuccessfulEvents && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
                Successful Events
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A look back at events we have already completed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {successfulEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden border border-border hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center"
                      />
                    ) : null}
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="inline-flex bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full w-fit">
                      {event.category}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{event.title}</h3>
                    <p className="text-muted-foreground">
                      Speaker: {event.speaker || event.description || 'TBA'}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
