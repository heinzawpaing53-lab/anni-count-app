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

  useEffect(() => {
    async function load() {
      const date = await getSetting("startDate");
      if (date) setStartDate(parseISO(date));
    }
    load();
  }, []);

  const handleSaveDate = async (date: Date | undefined) => {
    if (!date) return;
    setStartDate(date);
    setIsSaving(true);
    try {
      await setSetting("startDate", date.toISOString());
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
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-serif font-semibold text-primary tracking-tight">Settings</h1>
        <p className="text-muted-foreground italic font-serif">Personalize your experience.</p>
      </header>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-white to-primary/5 p-6 rounded-2xl shadow-lg border-2 border-primary/20 space-y-6">
          <div className="flex items-center gap-3 text-primary">
            <Heart size={20} className="fill-primary" />
            <h2 className="text-lg font-serif font-semibold">Relationship Details</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest font-bold text-primary/70 block">Select Start Date</Label>
              {startDate && (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm font-serif font-semibold text-primary">
                    💕 {format(startDate, "MMMM do, yyyy")}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center bg-white p-6 rounded-xl border border-primary/10 shadow-sm">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleSaveDate}
                showOutsideDays={false}
                className="[&_button]:rounded-lg [&_button]:border-primary/10"
              />
            </div>
            
            <p className="text-[10px] text-muted-foreground italic text-center">
              This date is used to calculate how many days you've been together.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50/50 to-destructive/5 p-6 rounded-2xl shadow-lg border-2 border-destructive/20 space-y-4">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle size={20} className="fill-destructive/20" />
            <h2 className="text-lg font-serif font-semibold">Danger Zone</h2>
          </div>
          
          <p className="text-sm text-muted-foreground italic">
            Once you delete your data, there is no going back. Please be certain.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full rounded-xl h-12 font-serif"
              >
                <Trash2 className="mr-2" size={18} />
                Clear All Data
              </Button>
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
                  className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-serif"
                >
                  Clear Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="text-center pt-8">
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/30">
            Everlasting v1.0
          </p>
          <p className="text-[10px] text-primary/20 italic mt-1">
            Made with love for you.
          </p>
        </div>
      </div>
    </div>
  );
}
