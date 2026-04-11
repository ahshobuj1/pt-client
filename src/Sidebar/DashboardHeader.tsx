'use client';

import { BellIcon, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UserProfileDropdown } from '@/shared/UserProfile';
import { apiSlice } from '@/redux/api/apiSlice';
import { persistor } from '@/redux/store';
import { X } from 'lucide-react';

export default function DashboardHeader() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  // Mock Notifications for UI demonstration
  const [notifications] = useState([
    {
      id: '1',
      title: 'Welcome to the Platform',
      message: 'You have successfully logged in.',
      createdAt: new Date().toISOString(),
      isRead: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = async () => {
    const toastId = toast.loading('Logging out...');
    dispatch(logout());
    await persistor.purge();
    dispatch(apiSlice.util.resetApiState());
    toast.success('Logout successful', {id: toastId});
    router.push('/login');
  };

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between lg:justify-end px-4 lg:px-6 gap-4">
      {/* Mobile Search */}
      <div className="lg:hidden flex-1 max-w-xs">
        {searchOpen ? (
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search..."
              className="h-9"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="md:hidden">
            <SearchIcon size={16} />
          </Button>
        )}
      </div>

      {/* Desktop Search */}
      <div className="hidden md:flex lg:hidden flex-1 max-w-sm text-center">
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search Assessment..." className="pl-9 h-9" />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <BellIcon size={16} />
              {unreadCount > 0 && (
                <Badge className="-top-2 -translate-x-1/2 absolute left-full min-w-5 px-1 text-xs text-rose-600 bg-rose-200">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="font-semibold mb-2">Notifications</div>
            <div className="text-sm text-muted-foreground">You have {unreadCount} unread notifications.</div>
          </PopoverContent>
        </Popover>

        {/* User Profile */}
        {user && <UserProfileDropdown user={user} onLogout={handleLogout} />}
      </div>
    </header>
  );
}
