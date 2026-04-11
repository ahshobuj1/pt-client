import { SIDEBAR_CONFIG, SidebarSection, SidebarItem } from "@/Sidebar/sidebar.config";
import { UserRole } from "@/types";

export function getSidebarItemsForRole(role: UserRole): SidebarItem[] {
  if (!role) return [];

  const allowedSections = SIDEBAR_CONFIG.filter(section =>
    section.roles.includes(role)
  );

  const items = allowedSections.flatMap(section => section.items);

  return items;
}