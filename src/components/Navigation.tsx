import { Link, useLocation } from "react-router-dom";
import {
  Bell,
  Heart,
  House,
  Images,
  Settings as SettingsIcon,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const navItems = [
  { icon: House, label: "Home", path: "/" },
  { icon: Images, label: "Memories", path: "/timeline" },
  { icon: UserRound, label: "Profile", path: "/profile" },
  { icon: Bell, label: "Alerts", path: "/notifications" },
  { icon: SettingsIcon, label: "Settings", path: "/settings" },
];

export function Navigation() {
  const location = useLocation();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(0.8rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-4">
      <nav className="pointer-events-auto w-[min(92%,31rem)] rounded-[999px] border border-[#E5E7EB] bg-white/96 px-3 py-2 shadow-[0_20px_45px_rgba(17,24,39,0.12)] backdrop-blur-[18px] transition-all duration-300 dark:border-[#22304A] dark:bg-[#0B1220]/96 dark:shadow-[0_20px_45px_rgba(0,0,0,0.4)]">
        <div className="flex h-[68px] items-center justify-between gap-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <motion.div
            key={item.path}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-full flex-1"
          >
            <Link
              to={item.path}
              className={cn(
                "relative flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-[28px] px-1 transition-all duration-300",
                isActive ? "text-[#4F8DFD] dark:text-[#D9E9FF]" : "text-[#111827] dark:text-[#F8FAFC]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavBubble"
                  className="absolute top-0 h-13 w-13 rounded-full bg-[#4F8DFD] shadow-[0_14px_28px_rgba(79,141,253,0.34)] dark:bg-[#6EA8FF] dark:shadow-[0_16px_30px_rgba(110,168,255,0.28)]"
                  transition={{ type: "spring", stiffness: 430, damping: 32 }}
                />
              )}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center">
                <item.icon
                  size={22}
                  strokeWidth={isActive ? 2.6 : 2.15}
                  className={cn(isActive ? "text-white dark:text-[#081224]" : "")}
                />
              </div>
              <span
                className={cn(
                  "relative z-10 text-[9px] font-bold uppercase tracking-[0.22em]",
                  isActive ? "text-[#4F8DFD] dark:text-[#D9E9FF]" : ""
                )}
              >
                {item.label}
              </span>
            </Link>
          </motion.div>
        );
      })}
        </div>
      </nav>
    </div>
  );
}
