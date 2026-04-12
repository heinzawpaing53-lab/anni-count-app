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
        <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl animate-pulse" />
        <div className="relative bg-white w-full h-full rounded-full shadow-xl border border-primary/20 flex flex-col items-center justify-center p-8">
          <Heart className="text-primary mb-2 fill-primary/20" size={40} strokeWidth={1.5} />
          <span className="text-4xl sm:text-5xl font-serif font-bold text-primary tracking-tighter">
            {daysTogether ?? "—"}
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground mt-1">
            Days Together
          </span>
        </div>
      </motion.div>

      <div className="text-center space-y-2 px-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-primary tracking-tight">
          Our Journey
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground italic font-serif">
          {startDate ? `Since ${format(parseISO(startDate), "MMMM do, yyyy")}` : "Set your start date in settings"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full mt-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-border flex flex-col items-center gap-1">
          <Sparkles className="text-primary/60" size={20} />
          <span className="text-xl font-serif font-medium">{Math.floor((daysTogether || 0) / 365)}</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Years</span>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-border flex flex-col items-center gap-1">
          <Heart className="text-primary/60" size={20} />
          <span className="text-xl font-serif font-medium">{Math.floor(((daysTogether || 0) % 365) / 30)}</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Months</span>
        </div>
      </div>
    </div>
  );
}
