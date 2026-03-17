"use client"

import type React from "react"
import { Option, makeStyles, tokens, shorthands } from "@fluentui/react-components"
import { cn } from "@/lib/utils"
import { createContext, useContext, useState } from "react"

const useStyles = makeStyles({
  dropdown: {
    width: "100%",
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    "&:hover": {
      borderColor: tokens.colorNeutralStroke1Hover,
    },
    "&:focus-within": {
      borderColor: tokens.colorBrandStroke1,
    },
  },
  listbox: {
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    boxShadow: tokens.shadow16,
  },
  option: {
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground4,
    },
    "&[aria-selected=true]": {
      backgroundColor: tokens.colorBrandBackground,
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
})

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
}

const SelectContext = createContext<SelectContextType>({
  value: "",
  onValueChange: () => {},
})

interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export function Select({ value: controlledValue, defaultValue, onValueChange, children }: SelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || "")
  const value = controlledValue ?? internalValue

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  return <SelectContext.Provider value={{ value, onValueChange: handleValueChange }}>{children}</SelectContext.Provider>
}

interface SelectTriggerProps {
  children?: React.ReactNode
  className?: string
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  const styles = useStyles()
  const { value } = useContext(SelectContext)

  return <div className={cn(styles.dropdown, className)}>{children || <span>{value}</span>}</div>
}

interface SelectValueProps {
  placeholder?: string
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const { value } = useContext(SelectContext)
  return <span>{value || placeholder}</span>
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

export function SelectContent({ children, className }: SelectContentProps) {
  const styles = useStyles()
  return <div className={cn(styles.listbox, className)}>{children}</div>
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function SelectItem({ value, children, className }: SelectItemProps) {
  const styles = useStyles()
  const { onValueChange } = useContext(SelectContext)

  return (
    <Option value={value} className={cn(styles.option, className)} onClick={() => onValueChange(value)}>
      {children}
    </Option>
  )
}
