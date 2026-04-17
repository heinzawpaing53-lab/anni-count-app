import { useEffect, useState } from "react";
import { getSetting, setSetting, db } from "@/src/db";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { Heart, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
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

export function Settings() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);

  useEffect(() => {
    async function load() {
      const date = await getSetting("startDate");
      if (date) {
        setStartDate(parseISO(date));
        setShowCalendar(false);
      }
    }
    load();
  }, []);

  const handleSaveDate = async (date: Date | undefined) => {
    if (!date) return;
    setStartDate(date);
    setIsSaving(true);
    try {
      await setSetting("startDate", date.toISOString());
      setShowCalendar(false);
      toast.success("Relationship start date updated!");
    } catch (error) {
      toast.error("Failed to update date.");
    } finally {
      setIsSaving(false);
    }
  };

  const clearAllData = async () => {
    try {
      await db.memories.clear();
      await db.settings.clear();
      toast.success("All data cleared.");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error("Failed to clear data.");
    }
  };

  return (
    <div className="min-h-full space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-serif font-semibold text-primary tracking-tight">Settings</h1>
        <p className="text-muted-foreground italic font-serif">Personalize your experience.</p>
      </header>

      <div className="space-y-6">
        <div className="romantic-surface space-y-6 border border-primary/14 bg-[#EAF3FF] p-7">
          <div className="flex items-center gap-3 text-primary">
            <Heart size={20} className="fill-primary" />
            <h2 className="text-lg font-serif font-semibold">Relationship Details</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="block text-xs font-bold uppercase tracking-widest text-primary/70">
                Select Start Date
              </Label>
              {startDate && (
                <div className="rounded-[20px] border border-primary/16 bg-primary/8 p-4">
                  <p className="text-sm font-serif font-semibold text-primary">
                    Love day: {format(startDate, "MMMM do, yyyy")}
                  </p>
                </div>
              )}
            </div>

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
                Change Start Date
              </Button>
            )}

            <p className="text-center text-[10px] italic text-muted-foreground">
              This date is used to calculate how many days you've been together.
            </p>
          </div>
        </div>

        <div className="romantic-surface space-y-4 border border-primary/14 bg-[#EAF3FF] p-7">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle size={20} className="fill-destructive/20" />
            <h2 className="text-lg font-serif font-semibold">Danger Zone</h2>
          </div>

          <p className="text-sm italic text-muted-foreground">
            Once you delete your data, there is no going back. Please be certain.
          </p>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="destructive"
                  className="h-12 w-full rounded-[20px] font-serif"
                />
              }
            >
              <Trash2 className="mr-2" size={18} />
              Clear All Data
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl border-primary/10">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-serif">Clear All Data?</AlertDialogTitle>
                <AlertDialogDescription className="italic font-serif">
                  This will permanently delete all your memories and settings. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl font-serif">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={clearAllData}
                  className="rounded-xl bg-destructive text-destructive-foreground font-serif hover:bg-destructive/90"
                >
                  Clear Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="pt-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/30">
            Everlasting v1.0
          </p>
          <p className="mt-1 text-[10px] italic text-primary/20">
            Made with love for you.
          </p>
        </div>
      </div>
    </div>
  );
}
