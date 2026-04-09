'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ImageIcon,
  Building2,
  Rocket,
  Settings,
  Globe,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const menuItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/team',
    label: 'Core Team',
    icon: Users,
  },
  {
    href: '/admin/events',
    label: 'Events',
    icon: Calendar,
  },
  // {
  //   href: '/admin/gallery',
  //   label: 'Gallery',
  //   icon: ImageIcon,
  // },
  {
    href: '/admin/startup',
    label: 'Startup List',
    icon: Rocket,
  },
  {
    href: '/admin/collaborations',
    label: 'Collaborations',
    icon: Building2,
  },
  // {
  //   href: '/admin/settings',
  //   label: 'Settings',
  //   icon: Settings,
  // },
  {
    href: '/',
    label: 'View Website',
    icon: Globe,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/logo.jpeg"
            alt="E-Cell logo"
            width={40}
            height={40}
            className="w-10 h-10 rounded-md object-cover"
            priority
          />
          <span className="font-bold text-lg text-sidebar-foreground">E-Cell</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
