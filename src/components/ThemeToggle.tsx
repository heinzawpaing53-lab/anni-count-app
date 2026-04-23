import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-3 gap-2 rounded-[22px] bg-white/70 p-2 shadow-[0_10px_24px_rgba(126,200,227,0.12)] dark:bg-[#0F1726]">
        {options.map((option) => (
          <div
            key={option.value}
            className="h-11 rounded-[18px] bg-background/80"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 rounded-[22px] bg-white/70 p-2 shadow-[0_10px_24px_rgba(126,200,227,0.12)] dark:bg-[#0F1726]">
      {options.map((option) => {
        const isActive = theme === option.value;
        const Icon = option.icon;

        return (
          <Button
            key={option.value}
            type="button"
            variant="ghost"
            className={cn(
              "h-11 rounded-[18px] border border-transparent font-serif text-sm font-semibold",
              isActive
                ? "bg-primary/16 text-primary shadow-[0_8px_24px_rgba(126,200,227,0.22)] ring-1 ring-primary/12 dark:bg-primary/22 dark:text-[#DFF6FF]"
                : "bg-transparent text-foreground hover:bg-secondary/30 hover:text-primary dark:text-[#E5E7EB] dark:hover:bg-secondary/16 dark:hover:text-[#DFF6FF]"
            )}
            onClick={() => setTheme(option.value)}
          >
            <Icon className={cn("mr-2", isActive && "text-primary dark:text-[#DFF6FF]")} size={16} />
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
