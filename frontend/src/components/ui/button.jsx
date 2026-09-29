import * as React from "react"
import { cn } from "@/lib/utils"

const sizes = {
  default: "h-9 px-4 py-2",
  lg: "h-10 px-8",
};

const Button = React.forwardRef(({ className, size = "default", ...props }, ref) => (
  <button
    className={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      sizes[size] || sizes.default,
      className,
    )}
    ref={ref}
    {...props}
  />
))
Button.displayName = "Button"

export { Button }
