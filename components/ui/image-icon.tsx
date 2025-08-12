import { ImageIcon as LucideImageIcon } from "lucide-react"

export default function ImageIcon({ className, ...props }: { className?: string; [key: string]: any }) {
  return <LucideImageIcon className={className} {...props} />
}
