"use client"

import type * as React from "react"
import { Bot, GalleryVerticalEnd, Settings2, Code, Download, ImageIcon, Home } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "DuckyCoder",
    email: "ai@duckycoder.dev",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  teams: [
    {
      name: "Waifu Downloader",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "DuckyCoder v7",
      logo: Code,
      plan: "Pro",
    },
    {
      name: "AI Analysis",
      logo: Bot,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/",
        },
        {
          title: "Statistics",
          url: "/stats",
        },
      ],
    },
    {
      title: "Downloads",
      url: "/downloads",
      icon: Download,
      items: [
        {
          title: "Simple Download",
          url: "/?tab=simple",
        },
        {
          title: "Advanced Download",
          url: "/?tab=download",
        },
        {
          title: "Collections",
          url: "/collections",
        },
      ],
    },
    {
      title: "Gallery",
      url: "/gallery",
      icon: ImageIcon,
      items: [
        {
          title: "All Images",
          url: "/gallery",
        },
        {
          title: "Favorites",
          url: "/favorites",
        },
      ],
    },
    {
      title: "DuckyCoder v7",
      url: "/duckycoder",
      icon: Code,
      items: [
        {
          title: "Analysis Dashboard",
          url: "/duckycoder",
        },
        {
          title: "Configuration",
          url: "/duckycoder?tab=config",
        },
        {
          title: "Security Scan",
          url: "/duckycoder/security",
        },
        {
          title: "Performance",
          url: "/duckycoder/performance",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings",
        },
        {
          title: "API Keys",
          url: "/settings?tab=api",
        },
        {
          title: "Download Settings",
          url: "/settings?tab=download",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
</merged_code>
