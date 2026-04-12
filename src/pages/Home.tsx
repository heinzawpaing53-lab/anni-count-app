import { useEffect, useState } from "react";
import { differenceInDays, format, parseISO } from "date-fns";
import { getSetting } from "@/src/db";
import { Heart, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function Home() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [daysTogether, setDaysTogether] = useState<number | null>(null);

  useEffect(() => {
    async function loadSettings() {
      const date = await getSetting("startDate");
      if (date) {
        setStartDate(date);
        const days = differenceInDays(new Date(), parseISO(date));
        setDaysTogether(days);
      }
    }
    loadSettings();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 md:gap-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-[280px] aspect-square"
      >
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl" 
        />
        <div className="relative bg-gradient-to-br from-white to-primary/5 dark:from-slate-800 dark:to-primary/10 w-full h-full rounded-full shadow-2xl border-2 border-primary/30 dark:border-primary/40 flex flex-col items-center justify-center p-8 backdrop-blur-sm">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="text-primary mb-2 fill-primary/30 dark:fill-primary/40" size={48} strokeWidth={1.5} />
          </motion.div>
          <span className="text-5xl sm:text-6xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent dark:from-primary dark:to-accent tracking-tighter">
            {daysTogether ?? "—"}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground dark:text-muted-foreground mt-2">
            Days Together
          </span>
        </div>
      </motion.div>

      <div className="text-center space-y-3 px-4">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent dark:from-primary dark:to-accent tracking-tight">
          Our Journey
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground italic font-serif">
          {startDate ? `Since ${format(parseISO(startDate), "MMMM do, yyyy")}` : "Set your start date in settings"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 w-full mt-4">
        <motion.div 
          whileHover={{ scale: 1.05, y: -2 }}
          className="bg-gradient-to-br from-white to-primary/5 dark:from-slate-800 dark:to-primary/10 p-5 rounded-2xl shadow-lg border border-primary/20 dark:border-primary/30 flex flex-col items-center gap-2 backdrop-blur-sm transition-all"
        >
          <Sparkles className="text-primary dark:text-primary" size={24} />
          <span className="text-2xl font-serif font-bold text-foreground">{Math.floor((daysTogether || 0) / 365)}</span>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">Years</span>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.05, y: -2 }}
          className="bg-gradient-to-br from-white to-accent/5 dark:from-slate-800 dark:to-accent/10 p-5 rounded-2xl shadow-lg border border-accent/20 dark:border-accent/30 flex flex-col items-center gap-2 backdrop-blur-sm transition-all"
        >
          <Heart className="text-primary dark:text-primary fill-primary/30 dark:fill-primary/40" size={24} />
          <span className="text-2xl font-serif font-bold text-foreground">{Math.floor(((daysTogether || 0) % 365) / 30)}</span>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">Months</span>
        </motion.div>
      </div>
    </div>
  );
}
