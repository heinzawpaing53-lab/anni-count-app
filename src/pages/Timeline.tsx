import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/src/db";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Heart,
  Trash2,
  Camera,
  Loader2,
  Sparkles,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
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

export function Timeline() {
  const memories = useLiveQuery(() => db.memories.orderBy("date").reverse().toArray());
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [image, setImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSaving(true);
    try {
      await db.memories.add({
        title,
        description,
        date,
        image: image || undefined,
        createdAt: new Date(),
      });
      toast.success("Memory saved to your timeline!");
      setTitle("");
      setDescription("");
      setDate(new Date());
      setImage(null);
      setShowForm(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Failed to save memory:", error);
      toast.error("Failed to save memory. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteMemory = async (id: number) => {
    try {
      await db.memories.delete(id);
      toast.success("Memory removed.");
    } catch (error) {
      toast.error("Failed to delete memory.");
    }
  };

  if (!memories) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-full bg-primary/5 p-6">
          <CalendarIcon size={48} className="text-primary/40" />
        </div>
        <h2 className="text-2xl font-serif font-medium text-primary">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-serif font-semibold text-primary tracking-tight">Timeline</h1>
        <p className="text-muted-foreground italic font-serif">Our story, one moment at a time.</p>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="romantic-surface space-y-5 border border-primary/14 bg-[#EAF3FF] p-7"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-semibold text-primary">Create New Memory</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowForm(false)}
                className="h-8 w-8 rounded-full"
              >
                <ChevronUp size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="title" className="text-xs uppercase tracking-widest font-bold text-primary/70">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="What happened today?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-[20px] border-primary/10 bg-[#FDFEFF] font-serif"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-widest font-bold text-primary/70">Date</Label>
                <Popover>
                  <PopoverTrigger
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-11 w-full justify-start rounded-[20px] border-primary/10 bg-[#FDFEFF] text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary/60" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => d && setDate(d)}
                      initialFocus
                      showOutsideDays={false}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1">
                <Label htmlFor="description" className="text-xs uppercase tracking-widest font-bold text-primary/70">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Tell the story..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] rounded-[20px] border-primary/10 bg-[#FDFEFF] text-sm italic font-serif"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-widest font-bold text-primary/70">
                  Photo (Optional)
                </Label>
                <div className="flex flex-col gap-3">
                  {image ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-[20px] border border-primary/10 bg-[#FDFEFF]">
                      <img src={image} alt="Preview" className="h-full w-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute right-2 top-2 h-7 w-7 rounded-full p-0 text-xs"
                        onClick={() => setImage(null)}
                      >
                        x
                      </Button>
                    </div>
                  ) : (
                    <label className="group flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-primary/18 bg-primary/5 transition-colors hover:bg-secondary/30">
                      <Camera className="text-primary/40 transition-colors group-hover:text-primary/70" size={24} />
                      <span className="mt-1 text-xs font-medium text-primary/50">Add photo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-[20px] border-primary/20"
                  onClick={() => {
                    setShowForm(false);
                    setTitle("");
                    setDescription("");
                    setImage(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-[20px] bg-primary font-serif text-white hover:bg-primary/90"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 animate-spin" size={18} />
                  ) : (
                    <Sparkles className="mr-2" size={18} />
                  )}
                  Save
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowForm(true)}
          className="romantic-surface group flex w-full items-center justify-center gap-2 border-2 border-dashed border-primary/20 bg-[#F1F7FF] p-5 transition-all hover:border-primary/40 hover:bg-[#E8F2FF]"
        >
          <div className="flex items-center gap-2 font-serif font-semibold text-primary">
            <Sparkles size={20} className="transition-transform group-hover:scale-110" />
            Add New Memory
            <ChevronDown size={20} className="transition-transform group-hover:scale-110" />
          </div>
        </motion.button>
      )}

      {memories.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="rounded-full bg-[#F1F7FF] p-6 shadow-[0_10px_24px_rgba(91,141,239,0.12)]">
            <CalendarIcon size={48} className="text-primary/40" />
          </div>
          <h2 className="text-2xl font-serif font-medium text-primary">No memories yet</h2>
          <p className="text-muted-foreground italic font-serif">
            Start capturing your beautiful moments together.
          </p>
        </div>
      ) : (
        <div className="relative space-y-8 pr-4 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-primary/20 before:via-primary/20 before:to-transparent">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4 sm:gap-6"
            >
              <div className="absolute left-0 mt-2 flex h-10 w-10 items-center justify-center">
                <Heart size={22} className="fill-[#8B7CF6] text-[#8B7CF6]" />
              </div>

              <Card className="romantic-surface ml-4 flex-1 overflow-hidden border-primary/10 bg-[#F7FBFF] transition-shadow hover:shadow-[0_12px_32px_rgba(31,42,68,0.1)] sm:ml-6">
                {memory.image && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={memory.image}
                      alt={memory.title}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-serif font-semibold text-primary">
                      {memory.title}
                    </CardTitle>
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          />
                        }
                      >
                        <Trash2 size={16} />
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-3xl border-primary/10">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-serif">Delete Memory?</AlertDialogTitle>
                          <AlertDialogDescription className="italic font-serif">
                            This beautiful moment will be removed from your timeline.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl font-serif">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMemory(memory.id!)}
                            className="rounded-xl bg-destructive text-destructive-foreground font-serif hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/60">
                    {format(memory.date, "MMMM do, yyyy")}
                  </p>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm leading-relaxed text-muted-foreground italic font-serif">
                    {memory.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
