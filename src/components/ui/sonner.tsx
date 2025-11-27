import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: 'group-[.toaster]:!bg-success group-[.toaster]:!text-success-foreground',
          error: 'group-[.toaster]:!bg-destructive group-[.toaster]:!text-destructive-foreground',
          warning: 'group-[.toaster]:!bg-warning group-[.toaster]:!text-warning-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
