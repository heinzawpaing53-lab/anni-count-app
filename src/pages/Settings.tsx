import { useEffect, useState, type FormEvent } from "react";
import { format, parseISO } from "date-fns";
import { Heart, Trash2, AlertCircle, LogOut, UserRound, Users, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAccount } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import { ThemeToggle } from "@/src/components/ThemeToggle";

export function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const [startDate, setStartDate] = useState<Date | undefined>(
    user?.anniversaryDate ? parseISO(user.anniversaryDate) : undefined
  );
  const [draftDate, setDraftDate] = useState<Date | undefined>(
    user?.anniversaryDate ? parseISO(user.anniversaryDate) : undefined
  );
  const [name, setName] = useState(user?.name ?? "");
  const [partnerName, setPartnerName] = useState(user?.partnerName ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [showCalendar, setShowCalendar] = useState(!user?.anniversaryDate);

  useEffect(() => {
    setName(user?.name ?? "");
    setPartnerName(user?.partnerName ?? "");
    setStartDate(user?.anniversaryDate ? parseISO(user.anniversaryDate) : undefined);
    setDraftDate(user?.anniversaryDate ? parseISO(user.anniversaryDate) : undefined);
  }, [user]);

  const handleSaveDate = async () => {
    if (!draftDate) return;
    setIsSaving(true);
    try {
      await updateProfile({ anniversaryDate: draftDate.toISOString() });
      setStartDate(draftDate);
      setShowCalendar(false);
      toast.success("Anniversary date updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update date.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNames = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({ name, partnerName });
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update names.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      await logout();
      toast.success("Account deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete account.");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out.");
  };

  const handleCancelDateChange = () => {
    setDraftDate(startDate);
    setShowCalendar(false);
  };

  return (
    <div className="min-h-full space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-serif font-semibold text-primary tracking-tight">Settings</h1>
        <p className="text-muted-foreground italic font-serif">Manage your account and love story details.</p>
      </header>

      <div className="space-y-6">
        <div className="romantic-surface space-y-5 border border-primary/14 bg-card/90 p-7 dark:bg-[#111827]">
          <div className="flex items-center gap-3 text-primary">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/12">
              <Sun size={18} className="dark:hidden" />
              <Moon size={18} className="hidden dark:block" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-semibold">Appearance</h2>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <form
          onSubmit={handleSaveNames}
          className="romantic-surface space-y-6 border border-primary/14 bg-card/90 p-7 dark:bg-[#111827]"
        >
          <div className="flex items-center gap-3 text-primary">
            <Heart size={20} className="fill-[#FF4D6D] text-[#FF4D6D]" />
            <h2 className="text-lg font-serif font-semibold">Relationship Details</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest font-bold text-primary/70">
                Your Name
              </Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={16} />
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-11 rounded-[20px] border-primary/10 bg-white/90 pl-10 dark:bg-[#0F1726]"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest font-bold text-primary/70">
                Partner Name
              </Label>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={16} />
                <Input
                  value={partnerName}
                  onChange={(event) => setPartnerName(event.target.value)}
                  className="h-11 rounded-[20px] border-primary/10 bg-white/90 pl-10 dark:bg-[#0F1726]"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full rounded-[20px] bg-primary font-serif text-white hover:bg-primary/90"
              disabled={isSaving}
            >
              Save Names
            </Button>
          </div>
        </form>

        <div className="romantic-surface space-y-6 border border-primary/14 bg-card/90 p-7 dark:bg-[#111827]">
          <div className="flex items-center gap-3 text-primary">
            <Heart size={20} className="fill-[#FF4D6D] text-[#FF4D6D]" />
            <h2 className="text-lg font-serif font-semibold">Anniversary Date</h2>
          </div>

          <div className="space-y-4">
            {startDate && (
              <div className="rounded-[20px] border border-primary/16 bg-white/90 p-4 dark:bg-[#0F1726]">
                <p className="text-sm font-serif font-semibold text-primary">
                  Anniversary: {format(startDate, "MMMM do, yyyy")}
                </p>
              </div>
            )}

            {showCalendar ? (
              <div className="romantic-surface space-y-5 border border-primary/10 bg-white/90 p-6 shadow-[0_10px_24px_rgba(126,200,227,0.12)] dark:bg-[#0F1726]">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={draftDate}
                    onSelect={setDraftDate}
                    showOutsideDays={false}
                    className="[&_button]:rounded-lg [&_button]:border-primary/10"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-[20px] border-primary/20 font-serif font-semibold"
                    onClick={handleCancelDateChange}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 rounded-[20px] bg-primary font-serif font-bold text-white hover:bg-primary/90 dark:text-[#0B1220]"
                    onClick={handleSaveDate}
                    disabled={!draftDate || isSaving}
                  >
                    Change Date
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-[20px] border-primary/20 font-serif"
                onClick={() => {
                  setDraftDate(startDate);
                  setShowCalendar(true);
                }}
                disabled={isSaving}
              >
                Change Anniversary Date
              </Button>
            )}
          </div>
        </div>

        <div className="romantic-surface space-y-4 border border-primary/14 bg-card/90 p-7 dark:bg-[#111827]">
          <div className="flex items-center gap-3 text-primary">
            <LogOut size={20} />
            <h2 className="text-lg font-serif font-semibold">Account</h2>
          </div>

          <p className="text-sm italic text-muted-foreground">
            Signed in as {user?.email}
          </p>

          <Button
            type="button"
            variant="outline"
            className="w-full rounded-[20px] border-primary/20 font-serif"
            onClick={handleLogout}
          >
            <LogOut className="mr-2" size={16} />
            Log Out
          </Button>
        </div>

        <div className="romantic-surface space-y-4 border border-[#D6EFFF] bg-[#F2FAFF] p-7 shadow-[0_14px_28px_rgba(126,200,227,0.12)] dark:border-[#1F2A44] dark:bg-[#0F1726] dark:shadow-[0_18px_36px_rgba(0,0,0,0.28)]">
          <div className="flex items-center gap-3 text-[#4F7F95] dark:text-[#BFE9FF]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DFF4FF] dark:bg-[#162033]">
              <AlertCircle size={20} className="fill-[#BFE9FF] text-[#7EC8E3] dark:fill-[#7EC8E3]/35 dark:text-[#BFE9FF]" />
            </div>
            <h2 className="text-lg font-serif font-semibold text-[#3E677A] dark:text-[#D6F0FF]">Danger Zone</h2>
          </div>

          <p className="text-sm italic text-[#5B7387] dark:text-[#C3D4EA]">
            This will permanently delete your account and all synced memories.
          </p>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="destructive"
                  className="h-12 w-full rounded-[20px] border border-[#B8DEEF] bg-[#DFF4FF] font-serif font-bold text-[#32576A] shadow-[0_12px_24px_rgba(126,200,227,0.16)] hover:bg-[#D1EEFF] dark:border-[#2A4269] dark:bg-[#18314A] dark:text-[#DFF4FF] dark:hover:bg-[#214163]"
                />
              }
            >
              <Trash2 className="mr-2" size={18} />
              Delete Account
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl border-2 border-[#D6EFFF] bg-[#F6FCFF] shadow-[0_24px_60px_rgba(126,200,227,0.16)] dark:border-[#1F2A44] dark:bg-[#0F1726] dark:shadow-[0_28px_60px_rgba(0,0,0,0.38)]">
              <AlertDialogHeader>
                <div className="mb-2 inline-flex w-fit rounded-full bg-[#DFF4FF] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#4F7F95] dark:bg-[#162033] dark:text-[#BFE9FF]">
                  Final Warning
                </div>
                <AlertDialogTitle className="font-serif text-2xl text-[#3E677A] dark:text-[#D6F0FF]">
                  Delete Account?
                </AlertDialogTitle>
                <AlertDialogDescription className="rounded-[20px] border border-[#D6EFFF] bg-white/90 p-4 text-left italic font-serif text-[#5B7387] dark:border-[#1F2A44] dark:bg-[#111827] dark:text-[#C3D4EA]">
                  This will delete your account, your anniversary setup, and your memories on every device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl border-[#D6EFFF] font-serif font-semibold text-[#1F2937] dark:border-[#1F2A44] dark:text-[#E5E7EB]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="rounded-xl border border-[#B8DEEF] bg-[#DFF4FF] px-5 text-base font-black tracking-[0.04em] text-[#32576A] shadow-[0_12px_24px_rgba(126,200,227,0.16)] hover:bg-[#D1EEFF] dark:border-[#2A4269] dark:bg-[#18314A] dark:text-[#DFF4FF] dark:hover:bg-[#214163]"
                >
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
