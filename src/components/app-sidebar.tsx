'use client';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { LayoutDashboard, FileText, Package, PieChart } from 'lucide-react';

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

const sidebarNav = [
  { title: '仪表盘', href: '/', icon: LayoutDashboard },
  { title: '工单', href: '#', icon: FileText, isActive: true },
  { title: '资产', href: '#', icon: Package },
  { title: '报告', href: '#', icon: PieChart },
];

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="hidden border-r bg-card md:block">
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="group-data-[collapsible=icon]:hidden">IDC 工单系统</span>
        </Link>
        <SidebarTrigger asChild={false}>
          <Button variant="ghost" size="icon" className="md:hidden" />
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sidebarNav.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={item.isActive}
                tooltip={{ children: item.title }}
              >
                <Link href={item.href}>
                  <div className="flex items-center gap-2">
                    <item.icon />
                    <span>{item.title}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
