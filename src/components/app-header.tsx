"use client";

import { useSidebar } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Menu, Package2 } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export default function AppHeader() {
  const { isMobile } = useSidebar();

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
      {!isMobile && (
        <Link href="#" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span>IDC 工单系统</span>
        </Link>
      )}
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
          仪表盘
        </Link>
        <Link
          href="#"
          className="text-foreground transition-colors hover:text-foreground font-semibold border-b-2 border-primary"
        >
          工单
        </Link>
        <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
          资产
        </Link>
        <Link href="#" className="text-muted-foreground transition-colors hover:text-foreground">
          报告
        </Link>
      </nav>
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
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="sr-only">IDC 工单系统</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              仪表盘
            </Link>
            <Link href="#" className="hover:text-foreground">
              工单
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              资产
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              报告
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
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
    </header>
  );
}
