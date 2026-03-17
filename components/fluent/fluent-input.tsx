"use client"
import {
  Input as FluentInput,
  makeStyles,
  tokens,
  shorthands,
  type InputProps as FluentInputProps,
} from "@fluentui/react-components"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

const useStyles = makeStyles({
  input: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    color: tokens.colorNeutralForeground1,
    width: "100%",
    "&:hover": {
      borderColor: tokens.colorNeutralStroke1Hover,
    },
    "&:focus-within": {
      borderColor: tokens.colorBrandStroke1,
      boxShadow: `0 0 0 2px ${tokens.colorBrandBackground}33`,
    },
    "& input": {
      backgroundColor: "transparent",
      color: tokens.colorNeutralForeground1,
      "&::placeholder": {
        color: tokens.colorNeutralForeground4,
      },
    },
  },
  withIcon: {
    paddingLeft: tokens.spacingHorizontalXXL,
  },
})

interface InputProps extends FluentInputProps {
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const styles = useStyles()

  return <FluentInput ref={ref} className={cn(styles.input, className)} {...props} />
})

Input.displayName = "Input"
