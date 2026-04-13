"use client"
import { ProgressBar, makeStyles, tokens, shorthands } from "@fluentui/react-components"
import { cn } from "@/lib/utils"

const useStyles = makeStyles({
  container: {
    width: "100%",
  },
  progress: {
    height: "8px",
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground4,
    "& > div": {
      background: `linear-gradient(90deg, ${tokens.colorBrandBackground}, #F43F5E)`,
      ...shorthands.borderRadius(tokens.borderRadiusMedium),
    },
  },
})

interface ProgressProps {
  value?: number
  max?: number
  className?: string
}

export function Progress({ value = 0, max = 100, className }: ProgressProps) {
  const styles = useStyles()

  return (
    <div className={cn(styles.container, className)}>
      <ProgressBar className={styles.progress} value={value / max} shape="rounded" thickness="large" />
    </div>
  )
}
