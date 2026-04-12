import { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center selection:bg-primary/10 dark:bg-gradient-to-br dark:from-background dark:to-primary/10">
      <main className="w-full max-w-md md:max-w-lg flex-1 pb-24 relative overflow-hidden bg-white/50 dark:bg-slate-900/40 md:shadow-2xl md:my-4 md:rounded-[3rem] md:border md:border-primary/20 dark:md:border-primary/30 backdrop-blur-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="p-6"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Navigation />
      <Toaster position="top-center" />
    </div>
  );
}
