"use client"

import type React from "react"
import { useState, createContext, useContext } from "react"
import {
  makeStyles,
  tokens,
  shorthands,
  Tooltip,
  Text,
  Avatar,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@fluentui/react-components"
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { authService } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const useStyles = makeStyles({
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: "260px",
    backgroundColor: tokens.colorNeutralBackground2,
    borderRightWidth: "1px",
    borderRightStyle: "solid",
    borderRightColor: tokens.colorBrandStroke1,
    display: "flex",
    flexDirection: "column",
    zIndex: 40,
    ...shorthands.transition("width", "200ms"),
  },
  sidebarCollapsed: {
    width: "72px",
  },
  header: {
    ...shorthands.padding(tokens.spacingVerticalL),
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.colorNeutralStroke2,
    display: "flex",
    alignItems: "center",
    ...shorthands.gap(tokens.spacingHorizontalM),
  },
  logo: {
    width: "40px",
    height: "40px",
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground}, #F43F5E)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 20px rgba(220, 38, 38, 0.5)",
  },
  content: {
    flex: 1,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalS),
    overflowY: "auto",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap(tokens.spacingHorizontalM),
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    color: tokens.colorNeutralForeground2,
    textDecorationLine: "none",
    ...shorthands.transition("all", "200ms"),
    marginBottom: tokens.spacingVerticalXS,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground4,
      color: tokens.colorNeutralForeground1,
      transform: "scale(1.02)",
    },
  },
  navItemActive: {
    backgroundColor: tokens.colorNeutralBackground5,
    color: tokens.colorBrandForeground1,
    boxShadow: `inset 3px 0 0 ${tokens.colorBrandBackground}`,
  },
  navIcon: {
    width: "20px",
    height: "20px",
    flexShrink: 0,
  },
  footer: {
    ...shorthands.padding(tokens.spacingVerticalM),
    borderTopWidth: "1px",
    borderTopStyle: "solid",
    borderTopColor: tokens.colorNeutralStroke2,
  },
  userButton: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap(tokens.spacingHorizontalM),
    width: "100%",
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: "transparent",
    ...shorthands.border("none"),
    cursor: "pointer",
    ...shorthands.transition("all", "200ms"),
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground4,
    },
  },
  toggleButton: {
    position: "absolute",
    right: "-12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "24px",
    height: "24px",
    ...shorthands.borderRadius("50%"),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 50,
    "&:hover": {
      backgroundColor: tokens.colorBrandBackground,
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
  main: {
    marginLeft: "260px",
    ...shorthands.transition("margin-left", "200ms"),
    minHeight: "100vh",
  },
  mainCollapsed: {
    marginLeft: "72px",
  },
})

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

const navigation = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Download", url: "/?tab=download", icon: Download },
  { title: "Gallery", url: "/gallery", icon: ImageIcon },
  { title: "Favorites", url: "/favorites", icon: Heart },
  { title: "Collections", url: "/collections", icon: FolderOpen },
  { title: "Settings", url: "/settings", icon: Settings2 },
]

export function FluentSidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return <SidebarContext.Provider value={{ collapsed, setCollapsed }}>{children}</SidebarContext.Provider>
}

export function FluentSidebar() {
  const styles = useStyles()
  const pathname = usePathname()
  const { collapsed, setCollapsed } = useSidebar()
  const user = authService.getCurrentUser()

  return (
    <aside className={cn(styles.sidebar, collapsed && styles.sidebarCollapsed)}>
      {/* Toggle Button */}
      <button
        className={styles.toggleButton}
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Header */}
      <div className={styles.header}>
        <motion.div
          className={styles.logo}
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
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Text weight="bold" size={400}>
              Waifu Hub
            </Text>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              v2.0 Premium
            </Text>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className={styles.content}>
        {navigation.map((item, index) => {
          const isActive = pathname === item.url || pathname.startsWith(item.url.split("?")[0])
          const Icon = item.icon

          const navLink = (
            <Link key={item.url} href={item.url} className={cn(styles.navItem, isActive && styles.navItemActive)}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <Icon className={cn(styles.navIcon, isActive && "text-[#DC2626]")} />
                {!collapsed && <span>{item.title}</span>}
              </motion.div>
            </Link>
          )

          if (collapsed) {
            return (
              <Tooltip content={item.title} relationship="label" positioning="after" key={item.url}>
                {navLink}
              </Tooltip>
            )
          }

          return navLink
        })}
      </nav>

      {/* Footer / User Menu */}
      <div className={styles.footer}>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <button className={styles.userButton}>
              <Avatar name={user?.username || "Guest"} image={{ src: user?.avatar }} size={32} color="brand" />
              {!collapsed && (
                <div className="flex-1 text-left">
                  <Text weight="semibold" size={300} block>
                    {user?.username || "Guest"}
                  </Text>
                  <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                    {user?.email || "Not logged in"}
                  </Text>
                </div>
              )}
            </button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              {user ? (
                <>
                  <MenuItem icon={<User className="w-4 h-4" />}>
                    <Link href="/account">Account</Link>
                  </MenuItem>
                  <MenuItem icon={<CreditCard className="w-4 h-4" />}>
                    <Link href="/billing">Billing</Link>
                  </MenuItem>
                  <MenuItem icon={<Bell className="w-4 h-4" />}>
                    <Link href="/notifications">Notifications</Link>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    icon={<LogOut className="w-4 h-4" />}
                    onClick={() => {
                      authService.logout()
                      window.location.href = "/login"
                    }}
                  >
                    Log out
                  </MenuItem>
                </>
              ) : (
                <MenuItem icon={<User className="w-4 h-4" />}>
                  <Link href="/login">Sign In</Link>
                </MenuItem>
              )}
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </aside>
  )
}

export function FluentSidebarInset({ children }: { children: React.ReactNode }) {
  const styles = useStyles()
  const { collapsed } = useSidebar()

  return <main className={cn(styles.main, collapsed && styles.mainCollapsed)}>{children}</main>
}
