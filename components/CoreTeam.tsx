'use client';

import { Card } from "./ui/card";

type TeamMember = {
  id: string;
  name: string;
  designation: string;
  photo: string;
};

type CoreTeamProps = {
  teamMembers: TeamMember[];
  pastMembers?: TeamMember[];
};

export default function CoreTeam({ teamMembers, pastMembers = [] }: CoreTeamProps) {
  return (
    <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Our Core Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the passionate individuals driving the entrepreneurial ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="overflow-hidden border border-border hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                <img
                  src={member.photo || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                <p className="text-sm text-primary font-semibold">{member.designation}</p>
              </div>
            </Card>
          ))}
        </div>

        {pastMembers.length > 0 && (
          <div className="mt-20 pt-20 border-t border-border">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Past Core Team Members
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Recognizing the contributions of our previous team members
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastMembers.map((member) => (
                <Card
                  key={member.id}
                  className="overflow-hidden border border-border opacity-75 hover:opacity-100 transition-opacity"
                >
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                    <img
                      src={member.photo || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                    <p className="text-sm text-primary font-semibold">{member.designation}</p>
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
