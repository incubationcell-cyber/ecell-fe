import { Card } from "../../components/ui/card";
import { BarChart3, Users, Calendar, ImageIcon } from 'lucide-react';

const stats = [
  {
    icon: Users,
    label: 'Team Members',
    value: '12',
    color: 'text-primary',
  },
  {
    icon: Calendar,
    label: 'Upcoming Events',
    value: '8',
    color: 'text-secondary',
  },
  {
    icon: ImageIcon,
    label: 'Gallery Items',
    value: '45',
    color: 'text-accent',
  },
  {
    icon: BarChart3,
    label: 'Active Members',
    value: '320',
    color: 'text-primary',
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-foreground">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 border border-border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-2">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Welcome Message */}
      <Card className="p-8 border border-border bg-gradient-to-r from-primary/5 to-secondary/5">
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          Welcome to E-Cell Admin Dashboard
        </h2>
        <p className="text-muted-foreground">
          Manage all aspects of the E-Cell website from this dashboard. Use the sidebar to navigate
          to different sections such as team members, events, gallery, and more.
        </p>
      </Card>
    </div>
  );
}
