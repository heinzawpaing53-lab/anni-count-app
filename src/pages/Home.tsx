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
        const days = differenceInDays(new Date(), parseISO(date)) + 1;
        setDaysTogether(days);
      }
    }
    loadSettings();
  }, []);

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-8 md:gap-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex w-full max-w-[320px] justify-center"
      >
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-x-4 top-6 h-[82%] rounded-full bg-gradient-to-br from-primary/25 via-secondary/70 to-accent/30 blur-3xl"
        />
        <div className="relative h-[320px] w-full">
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Heart
              className="h-[290px] w-[290px] fill-[url(#home-heart-gradient)] text-white drop-shadow-[0_16px_38px_rgba(91,141,239,0.28)]"
              strokeWidth={1.3}
            />
          </motion.div>
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="home-heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5B8DEF" />
                <stop offset="100%" stopColor="#AFCBFF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center text-white">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white/85">
              Together for
            </span>
            <span className="mt-2 text-5xl font-serif font-bold tracking-tighter text-white sm:text-6xl">
              {daysTogether ?? "-"}
            </span>
            <span className="mt-3 text-xs font-semibold tracking-[0.14em] text-white/90 sm:text-sm">
              Days of Love
            </span>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4 px-4 text-center">
        <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text font-serif text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          Our Journey
        </h1>
        <p className="font-serif text-sm italic text-muted-foreground sm:text-base">
          {startDate
            ? `Since ${format(parseISO(startDate), "MMMM do, yyyy")}`
            : "Set your start date in settings"}
        </p>
      </div>

      <div className="mt-2 grid w-full grid-cols-2 gap-5 sm:gap-6">
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          className="romantic-surface flex flex-col items-center gap-3 border border-primary/12 bg-[#EAF3FF] p-6 transition-all"
        >
          <Sparkles className="text-primary" size={24} />
          <span className="text-2xl font-serif font-bold text-foreground">
            {Math.floor((daysTogether || 0) / 365)}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Years
          </span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          className="romantic-surface flex flex-col items-center gap-3 border border-primary/12 bg-[#EAF3FF] p-6 transition-all"
        >
          <Heart className="fill-primary/20 text-primary" size={24} />
          <span className="text-2xl font-serif font-bold text-foreground">
            {Math.floor(((daysTogether || 0) % 365) / 30)}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Months
          </span>
        </motion.div>
      </div>
    </div>
  );
}
