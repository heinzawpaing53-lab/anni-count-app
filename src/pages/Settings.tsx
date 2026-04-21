import { useEffect, useState, type FormEvent } from "react";
import { format, parseISO } from "date-fns";
import { Heart, Trash2, AlertCircle, LogOut, UserRound, Users } from "lucide-react";
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

export function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const [startDate, setStartDate] = useState<Date | undefined>(
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
  }, [user]);

  const handleSaveDate = async (date: Date | undefined) => {
    if (!date) return;
    setStartDate(date);
    setIsSaving(true);
    try {
      await updateProfile({ anniversaryDate: date.toISOString() });
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

  return (
    <div className="min-h-full space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-serif font-semibold text-primary tracking-tight">Settings</h1>
        <p className="text-muted-foreground italic font-serif">Manage your account and love story details.</p>
      </header>

      <div className="space-y-6">
        <form
          onSubmit={handleSaveNames}
          className="romantic-surface space-y-6 border border-primary/14 bg-[#EAF3FF] p-7"
        >
          <div className="flex items-center gap-3 text-primary">
            <Heart size={20} className="fill-primary" />
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
                  className="h-11 rounded-[20px] border-primary/10 bg-[#FDFEFF] pl-10"
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
                  className="h-11 rounded-[20px] border-primary/10 bg-[#FDFEFF] pl-10"
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

        <div className="romantic-surface space-y-6 border border-primary/14 bg-[#EAF3FF] p-7">
          <div className="flex items-center gap-3 text-primary">
            <Heart size={20} className="fill-primary" />
            <h2 className="text-lg font-serif font-semibold">Anniversary Date</h2>
          </div>

          <div className="space-y-4">
            {startDate && (
              <div className="rounded-[20px] border border-primary/16 bg-[#FDFEFF] p-4">
                <p className="text-sm font-serif font-semibold text-primary">
                  Anniversary: {format(startDate, "MMMM do, yyyy")}
                </p>
              </div>
            )}

            {showCalendar ? (
              <div className="romantic-surface flex justify-center border border-primary/10 bg-[#FDFEFF] p-6 shadow-[0_10px_24px_rgba(91,141,239,0.08)]">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleSaveDate}
                  showOutsideDays={false}
                  className="[&_button]:rounded-lg [&_button]:border-primary/10"
                />
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-[20px] border-primary/20 font-serif"
                onClick={() => setShowCalendar(true)}
                disabled={isSaving}
              >
                Change Anniversary Date
              </Button>
            )}
          </div>
        </div>

        <div className="romantic-surface space-y-4 border border-primary/14 bg-[#EAF3FF] p-7">
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

        <div className="romantic-surface space-y-4 border border-[#E7BCC7] bg-[#FFF4F7] p-7 shadow-[0_14px_28px_rgba(214,118,141,0.1)]">
          <div className="flex items-center gap-3 text-[#B66278]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F9DDE5]">
              <AlertCircle size={20} className="fill-[#E7A8B8] text-[#C97890]" />
            </div>
            <h2 className="text-lg font-serif font-semibold text-[#A6566B]">Danger Zone</h2>
          </div>

          <p className="text-sm italic text-[#8A5D69]">
            This will permanently delete your account and all synced memories.
          </p>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="destructive"
                  className="h-12 w-full rounded-[20px] border border-[#D89CAC] bg-[#EFB6C3] font-serif font-bold text-[#6A2F40] shadow-[0_12px_24px_rgba(214,118,141,0.14)] hover:bg-[#E9A8B8]"
                />
              }
            >
              <Trash2 className="mr-2" size={18} />
              Delete Account
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl border-2 border-[#E7BCC7] bg-[#FFF7F8] shadow-[0_24px_60px_rgba(214,118,141,0.16)]">
              <AlertDialogHeader>
                <div className="mb-2 inline-flex w-fit rounded-full bg-[#F9DDE5] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#B66278]">
                  Final Warning
                </div>
                <AlertDialogTitle className="font-serif text-2xl text-[#A6566B]">
                  Delete Account?
                </AlertDialogTitle>
                <AlertDialogDescription className="rounded-[20px] border border-[#E9C7D0] bg-white/85 p-4 text-left italic font-serif text-[#875C68]">
                  This will delete your account, your anniversary setup, and your memories on every device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl border-[#DFC0C8] font-serif font-semibold text-[#1F2A44]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="rounded-xl border border-[#D89CAC] bg-[#EFB6C3] px-5 text-base font-black tracking-[0.04em] text-[#6A2F40] shadow-[0_12px_24px_rgba(214,118,141,0.16)] hover:bg-[#E9A8B8]"
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
