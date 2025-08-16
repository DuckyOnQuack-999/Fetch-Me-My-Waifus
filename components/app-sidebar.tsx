"use client"

import type * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Settings2,
  Download,
  Heart,
  ImageIcon,
  Folder,
  BarChart3,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Waifu Collector",
    email: "collector@waifudownloader.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  teams: [
    {
      name: "Waifu Downloader",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Anime Collection",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Manga Archive",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/",
        },
        {
          title: "Analytics",
          url: "/analytics",
        },
        {
          title: "Performance",
          url: "/performance",
        },
      ],
    },
    {
      title: "Downloads",
      url: "/downloads",
      icon: Download,
      items: [
        {
          title: "Queue",
          url: "/downloads/queue",
        },
        {
          title: "History",
          url: "/downloads/history",
        },
        {
          title: "Settings",
          url: "/downloads/settings",
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
          title: "Recent",
          url: "/gallery/recent",
        },
        {
          title: "Search",
          url: "/gallery/search",
        },
      ],
    },
    {
      title: "Collections",
      url: "/collections",
      icon: Folder,
      items: [
        {
          title: "My Collections",
          url: "/collections",
        },
        {
          title: "Create New",
          url: "/collections/new",
        },
        {
          title: "Shared",
          url: "/collections/shared",
        },
      ],
    },
    {
      title: "Favorites",
      url: "/favorites",
      icon: Heart,
      items: [
        {
          title: "All Favorites",
          url: "/favorites",
        },
        {
          title: "Recently Added",
          url: "/favorites/recent",
        },
        {
          title: "Most Viewed",
          url: "/favorites/popular",
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
          url: "/settings/api",
        },
        {
          title: "Download",
          url: "/settings/download",
        },
        {
          title: "Storage",
          url: "/settings/storage",
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
