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
    <div className="flex min-h-screen flex-col items-center bg-background selection:bg-primary/10">
      <div className="flex min-h-screen w-full max-w-md flex-1 flex-col bg-[#EAF3FF] backdrop-blur-sm md:my-4 md:min-h-[calc(100vh-2rem)] md:max-w-lg md:overflow-hidden md:rounded-[2rem] md:border md:border-primary/15 md:shadow-[0_10px_30px_rgba(31,42,68,0.08)]">
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="min-h-full p-7 md:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <Navigation />
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
