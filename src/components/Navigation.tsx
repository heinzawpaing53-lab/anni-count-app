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
    <nav className="flex w-full items-center justify-between border-t border-primary/10 bg-[#EAF3FF]/90 px-5 py-4 backdrop-blur-[10px] md:rounded-b-[2rem] md:shadow-[0_10px_30px_rgba(31,42,68,0.08)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <motion.div
            key={item.path}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1"
          >
            <Link
              to={item.path}
              className={cn(
                "relative flex flex-col items-center gap-1.5 rounded-[20px] px-3 py-2 transition-all duration-200",
                isActive
                  ? "scale-110 bg-[#DCEBFF] text-primary shadow-[0_8px_24px_rgba(91,141,239,0.18)]"
                  : "bg-[#F4F8FF] text-slate-500 hover:bg-[#DCEBFF] hover:text-primary"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -top-px left-3 right-3 h-1 rounded-b-lg bg-gradient-to-r from-transparent via-primary to-transparent"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-bold uppercase tracking-[0.22em]">
                {item.label}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
