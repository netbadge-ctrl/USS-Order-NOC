'use client';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { Package2 } from 'lucide-react';

interface AppSidebarProps {
  navItems: {
    title: string;
    href: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
}

export default function AppSidebar({ navItems }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="hidden border-r bg-card md:block">
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="group-data-[collapsible=icon]:hidden">IDC 工单系统</span>
        </Link>
        <SidebarTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden" />
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={item.isActive}
                tooltip={{ children: item.title }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
