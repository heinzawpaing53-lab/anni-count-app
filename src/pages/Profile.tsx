import { format, parseISO } from "date-fns";
import { Heart, Mail, UserRound, Users } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

export function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-full space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-primary">Profile</h1>
        <p className="font-serif italic text-muted-foreground">
          A quick look at your shared love story details.
        </p>
      </header>

      <div className="romantic-surface space-y-6 border border-primary/14 bg-card/90 p-7 dark:bg-[#111827]">
        <div className="flex items-center gap-3 text-primary">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/12">
            <Heart className="fill-[#FF4D6D] text-[#FF4D6D]" size={20} />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-foreground">
              {user ? `${user.name} & ${user.partnerName}` : "Your Couple Profile"}
            </h2>
            <p className="text-sm italic text-muted-foreground">
              Everything that makes this app feel like yours.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[22px] border border-primary/10 bg-white/90 p-4 dark:bg-[#0F1726]">
            <div className="flex items-center gap-3">
              <UserRound className="text-primary" size={18} />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/65">Your Name</p>
                <p className="font-serif text-xl font-semibold text-foreground">{user?.name ?? "-"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[22px] border border-primary/10 bg-white/90 p-4 dark:bg-[#0F1726]">
            <div className="flex items-center gap-3">
              <Users className="text-primary" size={18} />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/65">Partner Name</p>
                <p className="font-serif text-xl font-semibold text-foreground">{user?.partnerName ?? "-"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[22px] border border-primary/10 bg-white/90 p-4 dark:bg-[#0F1726]">
            <div className="flex items-center gap-3">
              <Mail className="text-primary" size={18} />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/65">Email</p>
                <p className="text-base font-medium text-foreground">{user?.email ?? "-"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[22px] border border-primary/10 bg-white/90 p-4 dark:bg-[#0F1726]">
            <div className="flex items-center gap-3">
              <Heart className="fill-[#FF4D6D] text-[#FF4D6D]" size={18} />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary/65">Anniversary</p>
                <p className="font-serif text-xl font-semibold text-foreground">
                  {user?.anniversaryDate
                    ? format(parseISO(user.anniversaryDate), "MMMM do, yyyy")
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
