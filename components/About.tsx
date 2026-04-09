'use client';

import { Card } from "./ui/card";
import { Lightbulb, Users, Zap, Trophy } from 'lucide-react';

const aboutPoints = [
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description: 'We believe in transforming ideas into reality through innovation and creativity.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'A thriving community of passionate entrepreneurs and mentors supporting each other.',
  },
  {
    icon: Zap,
    title: 'Accelerated Growth',
    description: 'Access resources, mentorship, and opportunities to scale your ventures rapidly.',
  },
  {
    icon: Trophy,
    title: 'Award Winning',
    description: 'Our members have won multiple awards and launched successful startups.',
  },
];

export default function About() {
  return (
    <section
      id="about"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            About E-Cell
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The Entrepreneurship Cell at Jaipur Engineering College is a hub for aspiring
            entrepreneurs. We foster innovation, provide mentorship, and create opportunities
            for students to build and scale their ventures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aboutPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <Card
                key={index}
                className="p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {point.title}
                </h3>
                <p className="text-muted-foreground text-sm">{point.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
