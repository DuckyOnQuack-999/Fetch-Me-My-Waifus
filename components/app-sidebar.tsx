"use client"

import type * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Heart,
  Download,
  FolderOpen,
  Home,
  ImageIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { SumptuousHeart } from "@/components/sumptuous-heart"

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
      name: "Personal Collection",
      logo: AudioWaveform,
      plan: "Free",
    },
    {
      name: "Shared Gallery",
      logo: Command,
      plan: "Pro",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Download",
      url: "#",
      icon: Download,
      items: [
        {
          title: "Simple Download",
          url: "/?tab=download",
        },
        {
          title: "Batch Download",
          url: "/batch",
        },
        {
          title: "Queue Manager",
          url: "/queue",
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
          url: "/gallery?filter=recent",
        },
        {
          title: "High Quality",
          url: "/gallery?filter=hq",
        },
      ],
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
      items: [
        {
          title: "My Collections",
          url: "/collections",
        },
        {
          title: "Shared",
          url: "/collections?filter=shared",
        },
        {
          title: "Public",
          url: "/collections?filter=public",
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
          title: "Downloads",
          url: "/settings?tab=download",
        },
        {
          title: "Appearance",
          url: "/settings?tab=appearance",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Anime Collection",
      url: "#",
      icon: Frame,
    },
    {
      name: "Waifu Archive",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Favorites Backup",
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
        <SumptuousHeart size={30} className="ml-2" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
