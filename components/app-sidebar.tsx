"use client"

import {
  Home,
  ImageIcon,
  Heart,
  FolderOpen,
  Settings2,
  Download,
  Sparkles,
  User,
  CreditCard,
  Bell,
  LogOut,
} from "lucide-react"
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
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg"
            animate={{
              boxShadow: [
                "0 0 20px rgba(220, 38, 38, 0.5)",
                "0 0 30px rgba(220, 38, 38, 0.8)",
                "0 0 20px rgba(220, 38, 38, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Sparkles className="h-6 w-6 text-white" />
          </motion.div>
          {!isCollapsed && (
            <motion.div
              className="flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-lg font-bold text-sidebar-foreground">Waifu Hub</span>
              <span className="text-xs text-sidebar-foreground/60">v2.0 Premium</span>
            </motion.div>
          )}
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {navigation.map((item, index) => {
            const isActive = pathname === item.url || pathname.startsWith(item.url.split("?")[0])

            return (
              <motion.div
                key={item.url}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SidebarMenuItem>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={cn(
                            "group transition-all duration-300 hover:scale-105",
                            isActive && "bg-sidebar-accent text-sidebar-accent-foreground shadow-md",
                          )}
                        >
                          <Link href={item.url} className="flex items-center gap-3 px-3 py-2">
                            <motion.div animate={isActive ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 0.3 }}>
                              <item.icon className={cn("h-5 w-5 transition-all", isActive && "text-primary")} />
                            </motion.div>
                            {!isCollapsed && <span className="font-medium">{item.title}</span>}
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right" className="glass-card">
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              </motion.div>
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
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-all duration-300"
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Avatar className="h-8 w-8 border-2 border-primary">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.username} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  {!isCollapsed && (
                    <div className="flex flex-1 flex-col gap-0.5 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.username || "Guest"}</span>
                      <span className="truncate text-xs text-sidebar-foreground/60">
                        {user?.email || "Not logged in"}
                      </span>
                    </div>
                  )}
                  {!isCollapsed && user?.subscription?.plan === "pro" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <Badge variant="default" className="ml-auto bg-gradient-to-r from-primary to-accent">
                        PRO
                      </Badge>
                    </motion.div>
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
                {user ? (
                  <>
                    {user.subscription?.plan !== "pro" && (
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
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={() => {
                        authService.logout()
                        window.location.href = "/login"
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
