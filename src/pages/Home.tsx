import { differenceInDays, format, parseISO } from "date-fns";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/src/context/AuthContext";

export function Home() {
  const { user } = useAuth();
  const startDate = user?.anniversaryDate || null;
  const daysTogether = startDate ? differenceInDays(new Date(), parseISO(startDate)) + 1 : null;
  const yourName = user?.name || "You";
  const partnerName = user?.partnerName || "Partner";
  const getInitials = (value: string) =>
    value
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?";
  const HeartAvatar = ({
    initials,
    gradient,
  }: {
    initials: string;
    gradient: string;
  }) => (
    <div className="relative flex h-28 w-28 items-center justify-center">
      <svg viewBox="0 0 120 110" className="absolute inset-0 h-full w-full drop-shadow-[0_14px_24px_rgba(91,141,239,0.2)]">
        <path
          d="M60 101C28 79 11 58 11 35C11 20 23 10 37 10C47 10 56 15 60 24C64 15 73 10 83 10C97 10 109 20 109 35C109 58 92 79 60 101Z"
          fill={gradient}
          stroke="white"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
      <span className="relative z-10 -mt-2 font-serif text-3xl font-bold text-white">{initials}</span>
    </div>
  );

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-8 md:gap-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex w-full max-w-[360px] justify-center"
      >
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-2 h-[360px] w-[390px] rounded-full bg-gradient-to-br from-primary/20 via-secondary/70 to-accent/25 blur-3xl"
        />
        <div className="relative h-[430px] w-full">
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2"
          >
            <Heart
              className="h-[380px] w-[380px] fill-[url(#home-heart-gradient)] text-white drop-shadow-[0_24px_54px_rgba(91,141,239,0.34)]"
              strokeWidth={2}
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
          <div className="absolute left-1/2 top-[146px] flex w-[210px] -translate-x-1/2 flex-col items-center text-center text-white">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/85 sm:text-sm">
              Together for
            </span>
            <span className="mt-3 leading-none text-6xl font-serif font-bold tracking-tighter text-white sm:text-7xl">
              {daysTogether ?? "-"}
            </span>
            <span className="mt-3 text-sm font-semibold tracking-[0.12em] text-white/90 sm:text-base">
              Days of Love
            </span>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4 px-4 text-center">
        <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text font-serif text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          {user ? `${yourName} & ${partnerName}` : "Our Journey"}
        </h1>
        <p className="font-serif text-sm italic text-muted-foreground sm:text-base">
          {startDate ? `Since ${format(parseISO(startDate), "MMMM do, yyyy")}` : "Set your anniversary date in settings"}
        </p>
      </div>

      <div className="relative mt-2 grid w-full grid-cols-2 gap-5 sm:gap-6">
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          className="flex flex-col items-center gap-4 p-2 text-center transition-all"
        >
          <HeartAvatar initials={getInitials(yourName)} gradient="url(#profile-heart-left)" />
          <span className="break-words font-serif text-2xl font-semibold text-[#1F2A44]">
            {yourName}
          </span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          className="flex flex-col items-center gap-4 p-2 text-center transition-all"
        >
          <HeartAvatar initials={getInitials(partnerName)} gradient="url(#profile-heart-right)" />
          <span className="break-words font-serif text-2xl font-semibold text-[#1F2A44]">
            {partnerName}
          </span>
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_10px_20px_rgba(31,42,68,0.08)]">
            <Heart className="h-6 w-6 fill-[#FF5A9F] text-[#FF5A9F]" />
          </div>
        </div>

        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="profile-heart-left" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8FB5FF" />
              <stop offset="100%" stopColor="#7FD1B9" />
            </linearGradient>
            <linearGradient id="profile-heart-right" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7FD1B9" />
              <stop offset="100%" stopColor="#8FB5FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
