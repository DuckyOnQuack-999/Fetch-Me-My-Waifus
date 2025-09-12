"use client"

import type React from "react"
import { Heart, Download, ImageIcon, FolderOpen, Settings, Home, Star, Sparkles } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SumptuousHeart } from "./sumptuous-heart"

const navigationItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Download",
    url: "/?tab=download",
    icon: Download,
  },
  {
    title: "Gallery",
    url: "/gallery",
    icon: ImageIcon,
  },
  {
    title: "Favorites",
    url: "/favorites",
    icon: Heart,
  },
  {
    title: "Collections",
    url: "/collections",
    icon: FolderOpen,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar {...props} className="glass-effect border-r border-pink-500/20">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 kawaii-element">
          <SumptuousHeart size={32} className="kawaii-heart" />
          <div>
            <h2 className="text-lg font-bold text-gradient">Waifu Fetcher</h2>
            <p className="text-xs text-muted-foreground neon-text">Cyber Kawaii Collection</p>
          </div>
          <Sparkles className="w-4 h-4 kawaii-heart animate-pulse-slow ml-auto" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-pink-300 font-medium flex items-center gap-2">
            <Star className="w-4 h-4 kawaii-heart" />
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url === "/" && pathname === "/") ||
                  (item.url.includes("tab=download") &&
                    pathname === "/" &&
                    window?.location?.search?.includes("tab=download"))

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="group transition-all duration-300 hover:bg-pink-500/10 kawaii-element"
                    >
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 kawaii-heart group-hover:scale-110 transition-transform" />
                        <span className="font-medium">{item.title}</span>
                        {isActive && <Heart className="w-3 h-3 kawaii-heart ml-auto animate-pulse-slow" />}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <SumptuousHeart size={16} className="kawaii-heart" />
            <span className="text-xs text-muted-foreground">Made with love</span>
            <SumptuousHeart size={16} className="kawaii-heart" />
          </div>
          <p className="text-xs text-muted-foreground neon-text">v2.0.0 Cyber Edition</p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
