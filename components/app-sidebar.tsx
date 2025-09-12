"use client"

import type * as React from "react"
import { Download, ImageIcon, Settings, BarChart3, Heart, FolderOpen, Shield, Cpu } from "lucide-react"
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
import { TeamSwitcher } from "@/components/team-switcher"
import { NavUser } from "@/components/nav-user"
import { ApiStatusIndicator } from "@/components/api-status-indicator"

// Simplified navigation data
const navigationData = {
  main: [
    {
      title: "Dashboard",
      url: "#dashboard",
      icon: BarChart3,
      isActive: true,
    },
    {
      title: "Download Center",
      url: "#download",
      icon: Download,
    },
  ],
  content: [
    {
      title: "Gallery",
      url: "#gallery",
      icon: ImageIcon,
    },
    {
      title: "Favorites",
      url: "#favorites",
      icon: Heart,
    },
    {
      title: "Collections",
      url: "#collections",
      icon: FolderOpen,
    },
  ],
  system: [
    {
      title: "Settings",
      url: "#settings",
      icon: Settings,
    },
    {
      title: "Performance",
      url: "#performance",
      icon: Cpu,
    },
    {
      title: "Security",
      url: "#security",
      icon: Shield,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props} className="border-r-2 border-primary/20">
      <SidebarHeader>
        <TeamSwitcher />
        <ApiStatusIndicator />
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="neon-text">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.isActive} className="cyber-button">
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="neon-text">Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.content.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="cyber-button">
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System & Configuration */}
        <SidebarGroup>
          <SidebarGroupLabel className="neon-text">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.system.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="cyber-button">
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
