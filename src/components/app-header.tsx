
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Menu, Package2 } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

export default function AppHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: '创建工单' },
    { href: '/reports', label: '工单进度' },
    { href: '/delivery', label: '交付清单' },
  ];

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6 sticky top-0 z-30">
      <nav className="flex-1 flex items-center gap-6 text-lg font-medium">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
                "text-sm transition-colors hover:text-foreground",
                pathname === link.href ? "text-foreground font-semibold border-b-2 border-primary" : "text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      
      <p className="text-xs text-muted-foreground mr-4">这是原型演示切换功能用的菜单，不是需求中的一部分</p>

      <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>我的账户</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>设置</DropdownMenuItem>
            <DropdownMenuItem>支持</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>登出</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
       <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">切换导航菜单</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Package2 className="h-6 w-6" />
              <span>IDC 工单系统</span>
            </Link>
            {navLinks.map(link => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "transition-colors hover:text-foreground",
                        pathname === link.href ? "text-foreground font-semibold" : "text-muted-foreground"
                    )}
                >
                    {link.label}
                </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

    