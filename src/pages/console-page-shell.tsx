type ConsolePageShellProps = {
  title: string
  description: string
}

export function ConsolePageShell({
  title,
  description,
}: ConsolePageShellProps) {
  return (
    <div className="flex flex-1 flex-col p-4 pt-0">
      <div className="min-h-[100vh] flex-1 md:min-h-min">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
