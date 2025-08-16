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
  Heart,
  ImageIcon,
  Settings,
  Home,
  Folder,
  Star,
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
    avatar: "/placeholder.svg?height=32&width=32&text=WC",
  },
  teams: [
    {
      name: "Waifu Downloader",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Personal Collection",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Shared Gallery",
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
          title: "Download Center",
          url: "/?tab=download",
        },
        {
          title: "Queue Manager",
          url: "/downloads/queue",
        },
        {
          title: "History",
          url: "/downloads/history",
        },
        {
          title: "Failed Downloads",
          url: "/downloads/failed",
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
          title: "Categories",
          url: "/gallery/categories",
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
        {
          title: "Archived",
          url: "/collections/archived",
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
          title: "Download Preferences",
          url: "/settings/downloads",
        },
        {
          title: "Storage",
          url: "/settings/storage",
        },
        {
          title: "Privacy",
          url: "/settings/privacy",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Waifu Collection 2024",
      url: "/collections/waifu-2024",
      icon: Frame,
    },
    {
      name: "Neko Archive",
      url: "/collections/neko-archive",
      icon: PieChart,
    },
    {
      name: "Seasonal Favorites",
      url: "/collections/seasonal",
      icon: Map,
    },
    {
      name: "High Quality Pack",
      url: "/collections/hq-pack",
      icon: Star,
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
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
