"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Download, ImageIcon, Heart, Settings, FolderOpen, Home } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SumptuousHeart } from "./sumptuous-heart"

export function AppSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Download, label: "Download", href: "/?tab=download" },
    { icon: ImageIcon, label: "Gallery", href: "/gallery" },
    { icon: Heart, label: "Favorites", href: "/favorites" },
    { icon: FolderOpen, label: "Collections", href: "/collections" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <Sidebar className="border-r border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-6 py-4">
          <SumptuousHeart size={40} className="flex-shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-gradient">Waifu</h2>
            <p className="text-xs text-muted-foreground">Downloader</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild className={`nav-item ${pathname === item.href ? "active" : ""}`}>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-6 py-4">
          <p className="text-xs text-muted-foreground">Built with ❤️ by weebs</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
