"use client"

import type * as React from "react"
import { Download, ImageIcon, Settings2, Home, Activity } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Waifu Collector",
    email: "collector@waifudownloader.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  teams: [
    {
      name: "Waifu Downloader",
      logo: ImageIcon,
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
      title: "Download Center",
      url: "#",
      icon: Download,
      items: [
        {
          title: "Simple Download",
          url: "/?tab=download",
        },
        {
          title: "Batch Operations",
          url: "/?tab=batch",
        },
        {
          title: "Queue Manager",
          url: "/?tab=queue",
        },
        {
          title: "Download History",
          url: "/?tab=history",
        },
      ],
    },
    {
      title: "Gallery & Collections",
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
        {
          title: "Recent Downloads",
          url: "/gallery?filter=recent",
        },
      ],
    },
    {
      title: "System & Stats",
      url: "#",
      icon: Activity,
      items: [
        {
          title: "Performance Monitor",
          url: "/?tab=performance",
        },
        {
          title: "Storage Usage",
          url: "/?tab=storage",
        },
        {
          title: "API Status",
          url: "/?tab=api-status",
        },
        {
          title: "Statistics",
          url: "/?tab=stats",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General Settings",
          url: "/settings",
        },
        {
          title: "API Configuration",
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
