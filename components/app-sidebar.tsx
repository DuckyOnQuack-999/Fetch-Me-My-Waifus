"use client"

import type React from "react"
import { Heart, Download, ImageIcon, Star, FolderOpen, Settings, User, Sparkles, Zap } from "lucide-react"

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

// Navigation data
const data = {
  navMain: [
    {
      title: "Download",
      url: "/",
      icon: Download,
      isActive: true,
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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="glass-effect border-r border-pink-500/30">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 kawaii-element">
          <SumptuousHeart className="w-8 h-8 kawaii-heart" />
          <span className="text-lg font-bold text-gradient">Waifu Fetcher</span>
          <Sparkles className="w-4 h-4 kawaii-heart animate-pulse-slow" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-pink-300 font-medium flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className="group cyber-button hover:bg-pink-500/20 transition-all duration-300"
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 kawaii-heart group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{item.title}</span>
                      <Heart className="w-3 h-3 kawaii-heart ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="cyber-button">
              <User className="kawaii-heart" />
              <span>Profile</span>
              <Star className="w-3 h-3 kawaii-heart ml-auto animate-pulse-slow" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail className="pulse-node" />
    </Sidebar>
  )
}
