import { Card } from './ui/card';

type StartupItem = {
  id: string | number;
  name: string;
  founder: string;
  description: string;
  website: string;
};

type StartupListProps = {
  startups?: StartupItem[];
};

export default function StartupList({ startups = [] }: StartupListProps) {
  return (
    <section id="startups" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Startup List
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover startup partners and initiatives connected with E-Cell.
          </p>
        </div>

        {startups.length === 0 ? (
          <Card className="p-8 text-center border border-border">
            <p className="text-muted-foreground">No startups available right now.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup) => (
              <Card key={startup.id} className="border border-border hover:shadow-lg transition-shadow">
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-foreground">{startup.name}</h3>
                  <p className="text-sm text-primary font-semibold">Founder: {startup.founder || 'N/A'}</p>
                  <p className="text-muted-foreground line-clamp-4">{startup.description || 'No description available.'}</p>
                  {startup.website ? (
                    <a
                      href={startup.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-sm font-medium text-primary hover:underline break-all"
                    >
                      {startup.website}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">Website not available</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
