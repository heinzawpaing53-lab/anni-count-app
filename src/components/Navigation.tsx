import { Link, useLocation } from "react-router-dom";
import { Heart, Calendar, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const navItems = [
  { icon: Heart, label: "Home", path: "/" },
  { icon: Calendar, label: "Timeline", path: "/timeline" },
  { icon: SettingsIcon, label: "Settings", path: "/settings" },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-white/90 via-primary/5 to-white/90 dark:from-slate-900/90 dark:via-primary/10 dark:to-slate-900/90 backdrop-blur-xl border-t border-primary/20 dark:border-primary/30 px-6 py-4 flex justify-between items-center z-50 max-w-md md:max-w-lg mx-auto md:bottom-8 md:rounded-full md:border md:shadow-2xl md:bg-gradient-to-r md:from-white/95 md:via-primary/10 md:to-white/95 dark:md:from-slate-900/95 dark:md:via-primary/20 dark:md:to-slate-900/95">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <motion.div
            key={item.path}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200",
                isActive
                  ? "text-primary dark:text-primary scale-110"
                  : "text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -top-px left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-b-lg"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-bold uppercase tracking-widest">
                {item.label}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
