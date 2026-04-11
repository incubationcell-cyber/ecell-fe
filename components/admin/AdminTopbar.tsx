'use client';

import { Button } from '../ui/button';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';

export default function AdminTopbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include',
    });

    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="h-16 bg-background border-b border-border px-6 flex items-center justify-end">
      {/* Search */}
      {/* <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 bg-muted border-border text-foreground"
          />
        </div>
      </div> */}

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </button>

        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <User className="w-5 h-5 text-foreground" />
        </button> */}

        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2 text-red-500" />
          Logout
        </Button>
      </div>
    </div>
  );
}
