import { UserRole } from '@/types';
import { LucideIcon } from 'lucide-react';

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface SidebarSection {
  title: string;
  roles: UserRole[];
  items: SidebarItem[];
}
import {
  LayoutDashboard,
  PlusSquare,
  FileText,
  User,
  HelpCircle,
} from 'lucide-react';

export const SIDEBAR_CONFIG: SidebarSection[] = [
  {
    title: 'Employer Panel',
    roles: ['EMPLOYER'],
    items: [
      {
        title: 'Dashboard',
        url: '/employer/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Create Test',
        url: '/employer/exams/new',
        icon: PlusSquare,
      },
    ],
  },
  {
    title: 'Candidate Panel',
    roles: ['CANDIDATE'],
    items: [
      {
        title: 'My Exams',
        url: '/candidate/dashboard',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Account Settings',
    roles: ['EMPLOYER', 'CANDIDATE'],
    items: [
      {
        title: 'Profile',
        url: '#',
        icon: User,
      },
      {
        title: 'Help & Support',
        url: '#',
        icon: HelpCircle,
      },
    ],
  },
];
