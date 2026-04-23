import { Bell, Heart } from "lucide-react";

export function Notifications() {
  return (
    <div className="min-h-full space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-primary">Notifications</h1>
        <p className="font-serif italic text-muted-foreground">
          Gentle reminders and updates from your shared memory space.
        </p>
      </header>

      <div className="romantic-surface border border-primary/14 bg-card/90 p-7 dark:bg-[#111827]">
        <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/12 shadow-[0_12px_28px_rgba(126,200,227,0.18)]">
            <Bell className="text-primary" size={30} />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">All Quiet for Now</h2>
          <p className="max-w-xs font-serif italic text-muted-foreground">
            When you add more lovely moments and reminders, they can live here beautifully.
          </p>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-secondary/25 px-4 py-2 text-sm font-semibold text-primary">
            <Heart className="fill-[#FF4D6D] text-[#FF4D6D]" size={16} />
            Peaceful and up to date
          </div>
        </div>
      </div>
    </div>
  );
}
