'use client'

import { SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()

  return (
    <SidebarInset className="flex-1">
      <header className="flex h-16 items-center gap-4 border-b border-border/40 px-6 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <SidebarTrigger />
        <ThemeToggle />
      </header>
      {children}
    </SidebarInset>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="mr-6"
    >
      <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
