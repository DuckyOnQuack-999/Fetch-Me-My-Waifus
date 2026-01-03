"use client"
import {
  Button as FluentButton,
  makeStyles,
  tokens,
  shorthands,
  type ButtonProps as FluentButtonProps,
} from "@fluentui/react-components"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

const useStyles = makeStyles({
  primary: {
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground}, #F43F5E)`,
    color: tokens.colorNeutralForegroundOnBrand,
    ...shorthands.border("none"),
    boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)",
    ...shorthands.transition("all", "200ms"),
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: "0 0 30px rgba(220, 38, 38, 0.6)",
    },
    "&:active": {
      transform: "scale(0.98)",
    },
  },
  outline: {
    backgroundColor: "transparent",
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    color: tokens.colorNeutralForeground1,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground3,
      borderColor: tokens.colorBrandStroke1,
    },
  },
  ghost: {
    backgroundColor: "transparent",
    ...shorthands.border("none"),
    color: tokens.colorNeutralForeground2,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground3,
      color: tokens.colorNeutralForeground1,
    },
  },
  destructive: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    color: tokens.colorNeutralForegroundOnBrand,
    "&:hover": {
      backgroundColor: tokens.colorPaletteRedBackground2,
    },
  },
  secondary: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
    ...shorthands.border("1px", "solid", tokens.colorNeutralStroke1),
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground4,
    },
  },
  link: {
    backgroundColor: "transparent",
    ...shorthands.border("none"),
    color: tokens.colorBrandForeground1,
    ...shorthands.padding("0"),
    minWidth: "auto",
    height: "auto",
    "&:hover": {
      textDecorationLine: "underline",
    },
  },
  sm: {
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
    fontSize: tokens.fontSizeBase200,
  },
  lg: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    fontSize: tokens.fontSizeBase400,
  },
  icon: {
    minWidth: "32px",
    width: "32px",
    height: "32px",
    ...shorthands.padding("0"),
  },
})

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
type Size = "default" | "sm" | "lg" | "icon"

interface ButtonProps extends Omit<FluentButtonProps, "size"> {
  variant?: Variant
  size?: Size
  className?: string
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className, children, asChild, ...props }, ref) => {
    const styles = useStyles()

    const getVariantStyle = () => {
      switch (variant) {
        case "destructive":
          return styles.destructive
        case "outline":
          return styles.outline
        case "secondary":
          return styles.secondary
        case "ghost":
          return styles.ghost
        case "link":
          return styles.link
        default:
          return styles.primary
      }
    }

    const getSizeStyle = () => {
      switch (size) {
        case "sm":
          return styles.sm
        case "lg":
          return styles.lg
        case "icon":
          return styles.icon
        default:
          return ""
      }
    }

    return (
      <FluentButton
        ref={ref}
        className={cn(getVariantStyle(), getSizeStyle(), className)}
        appearance={variant === "default" ? "primary" : "subtle"}
        {...props}
      >
        {children}
      </FluentButton>
    )
  },
)

Button.displayName = "Button"
