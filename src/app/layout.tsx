import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/app-header';
import { LayoutDashboard, FileText, Package, PieChart } from 'lucide-react';
import AppSidebar from '@/components/app-sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IDC 工单系统',
  description: '轻松管理服务器工单。',
};

const sidebarNav = [
  { title: '仪表盘', href: '/', icon: LayoutDashboard },
  { title: '工单', href: '#', icon: FileText, isActive: true },
  { title: '资产', href: '#', icon: Package },
  { title: '报告', href: '#', icon: PieChart },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <SidebarProvider defaultOpen>
          <AppSidebar navItems={sidebarNav} />
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background">
              {children}
            </main>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
