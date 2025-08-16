"use client"

import type * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Download,
  ImageIcon,
  Settings,
  Home,
  FolderOpen,
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
      plan: "Pro",
    },
    {
      name: "Anime Collection",
      logo: AudioWaveform,
      plan: "Free",
    },
    {
      name: "Image Gallery",
      logo: Command,
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
          url: "/?tab=stats",
        },
        {
          title: "Quick Actions",
          url: "/?tab=actions",
        },
      ],
    },
    {
      title: "Downloads",
      url: "/?tab=download",
      icon: Download,
      items: [
        {
          title: "Download Center",
          url: "/?tab=download",
        },
        {
          title: "Queue Manager",
          url: "/downloads/queue",
        },
        {
          title: "Download History",
          url: "/downloads/history",
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
        {
          title: "Collections",
          url: "/collections",
        },
      ],
    },
    {
      title: "Collections",
      url: "/collections",
      icon: FolderOpen,
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
      title: "Settings",
      url: "/settings",
      icon: Settings,
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
          title: "Download Settings",
          url: "/settings/downloads",
        },
        {
          title: "Storage",
          url: "/settings/storage",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Waifu Collection",
      url: "#",
      icon: Frame,
    },
    {
      name: "Neko Gallery",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Anime Archive",
      url: "#",
      icon: Map,
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
