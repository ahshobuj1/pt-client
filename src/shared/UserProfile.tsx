'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {LogOutIcon, ChevronDownIcon} from 'lucide-react';
import {useAppDispatch} from '@/redux/hooks';
import {logout} from '@/redux/features/auth/authSlice';
import {toast} from 'sonner';
import {apiSlice} from '@/redux/api/apiSlice';
import {Badge} from '@/components/ui/badge';
import {persistor} from '@/redux/store';

interface UserProfileDropdownProps {
  user: {
    displayName?: string;
    email?: string;
    photoURL?: string | null;
    role?: string;
  };
  onLogout?: () => void;
}

export function UserProfileDropdown({user, onLogout}: UserProfileDropdownProps) {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
      return;
    }

    const toastId = toast.loading('Logging out...');
    dispatch(logout());
    await persistor.purge();
    dispatch(apiSlice.util.resetApiState());
    
    setLogoutDialogOpen(false);
    toast.success('Logout successful', {id: toastId});
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.photoURL || '/origin/avatar.jpg'}
              alt="Profile image"
            />
            <AvatarFallback className="font-bold text-gray-700">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon size={16} className="opacity-60 hidden lg:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="flex flex-col gap-1 p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm truncate uppercase tracking-tight">
              User Profile
            </span>
            <Badge className="bg-primary/10 text-primary border-none">{user?.role}</Badge>
          </div>
          <span className="text-xs text-muted-foreground truncate">
            {user?.email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => setLogoutDialogOpen(true)}
          className="cursor-pointer text-destructive">
          <LogOutIcon size={16} className="opacity-60 mr-2" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* Logout confirmation */}
      {logoutDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold">Confirm Logout</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to logout?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setLogoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </DropdownMenu>
  );
}
