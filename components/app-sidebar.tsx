"use client"

import { Home, ImageIcon, Heart, FolderOpen, Settings2, Download, Sparkles, User, CreditCard, Bell } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authService } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const navigation = [
  {
    title: "Dashboard",
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
    icon: Settings2,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const user = authService.getCurrentUser()

  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent animate-pulse-glow">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-fade-in">
              <span className="text-lg font-bold text-sidebar-foreground">Waifu Hub</span>
              <span className="text-xs text-sidebar-foreground/60">v2.0 Premium</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navigation.map((item) => {
            const isActive = pathname === item.url || pathname.startsWith(item.url.split("?")[0])

            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className={cn(
                    "group transition-all duration-300",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground shadow-md",
                  )}
                >
                  <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                    <item.icon
                      className={cn("h-5 w-5 transition-all", isActive && "text-primary animate-pulse-glow")}
                    />
                    {!isCollapsed && <span className="font-medium">{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 border-2 border-primary">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.username} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex flex-1 flex-col gap-0.5 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.username || "Guest"}</span>
                      <span className="truncate text-xs text-sidebar-foreground/60">{user?.email || "No account"}</span>
                    </div>
                  )}
                  {!isCollapsed && user?.subscription?.plan === "pro" && (
                    <Badge variant="default" className="ml-auto bg-gradient-to-r from-primary to-accent">
                      PRO
                    </Badge>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-card" align="end" side="right">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username || "Guest"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email || "Not logged in"}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user?.subscription?.plan !== "pro" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/upgrade" className="cursor-pointer">
                        <Sparkles className="mr-2 h-4 w-4 text-primary" />
                        Upgrade to Pro
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/billing" className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/notifications" className="cursor-pointer">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    authService.logout()
                    window.location.href = "/login"
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
