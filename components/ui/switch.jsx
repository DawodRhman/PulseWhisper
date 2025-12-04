import * as React from "react"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef(({ className, onCheckedChange, ...props }, ref) => (
  <input
    type="checkbox"
    className={cn(
      "peer h-[24px] w-[44px] shrink-0 cursor-pointer appearance-none rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input bg-slate-200 checked:bg-slate-900 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all checked:after:translate-x-5",
      className
    )}
    ref={ref}
    onChange={(e) => onCheckedChange?.(e.target.checked)}
    {...props}
  />
))
Switch.displayName = "Switch"

export { Switch }
