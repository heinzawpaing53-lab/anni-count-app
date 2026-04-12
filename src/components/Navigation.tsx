import { Link, useLocation } from "react-router-dom";
import { Heart, Calendar, PlusCircle, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Heart, label: "Home", path: "/" },
  { icon: Calendar, label: "Timeline", path: "/timeline" },
  { icon: PlusCircle, label: "Add", path: "/add" },
  { icon: SettingsIcon, label: "Settings", path: "/settings" },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-border px-6 py-3 flex justify-between items-center z-50 max-w-md md:max-w-lg mx-auto md:bottom-8 md:rounded-full md:border md:shadow-lg">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
            )}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
