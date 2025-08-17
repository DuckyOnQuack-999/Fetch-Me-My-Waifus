"use client"

import type * as React from "react"
import {
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Download,
  Heart,
  ImageIcon,
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
    name: "Waifu Downloader",
    email: "user@waifudownloader.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  teams: [
    {
      name: "Waifu Downloader",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "AI Enhanced",
      logo: Bot,
      plan: "Pro",
    },
    {
      name: "Quantum Ready",
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
    },
    {
      title: "Download",
      url: "/?tab=download",
      icon: Download,
      items: [
        {
          title: "Simple Download",
          url: "/?tab=download",
        },
        {
          title: "Batch Download",
          url: "/batch-download",
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
          url: "/collections/shared",
        },
        {
          title: "Create New",
          url: "/collections/new",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "API Keys",
          url: "/settings?tab=api",
        },
        {
          title: "Download Settings",
          url: "/settings?tab=download",
        },
        {
          title: "Appearance",
          url: "/settings?tab=appearance",
        },
        {
          title: "Advanced",
          url: "/settings?tab=advanced",
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
      name: "Anime Artwork",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Character Gallery",
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
