"use client"

import type React from "react"
import {
  TabList,
  Tab,
  makeStyles,
  tokens,
  shorthands,
  type SelectTabData,
  type SelectTabEvent,
} from "@fluentui/react-components"
import { cn } from "@/lib/utils"
import { createContext, useContext, useState } from "react"

const useStyles = makeStyles({
  tabList: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalXS),
    ...shorthands.gap(tokens.spacingHorizontalXS),
  },
  tab: {
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    color: tokens.colorNeutralForeground2,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground4,
    },
    "&[aria-selected=true]": {
      backgroundColor: tokens.colorBrandBackground,
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
  content: {
    marginTop: tokens.spacingVerticalL,
  },
})

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType>({
  value: "",
  onValueChange: () => {},
})

interface TabsProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ value: controlledValue, defaultValue, onValueChange, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || "")
  const value = controlledValue ?? internalValue

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn("fluent-tabs", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export function TabsList({ children, className }: TabsListProps) {
  const styles = useStyles()
  const { value, onValueChange } = useContext(TabsContext)

  const handleTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    onValueChange(data.value as string)
  }

  return (
    <TabList className={cn(styles.tabList, className)} selectedValue={value} onTabSelect={handleTabSelect}>
      {children}
    </TabList>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const styles = useStyles()

  return (
    <Tab value={value} className={cn(styles.tab, className)}>
      {children}
    </Tab>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const styles = useStyles()
  const { value: selectedValue } = useContext(TabsContext)

  if (selectedValue !== value) return null

  return <div className={cn(styles.content, className)}>{children}</div>
}
