import { format, parseISO } from "date-fns";
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
import React, { useEffect, useState } from "react";
import { createMemory, deleteMemory, getMemories, type MemoryRecord } from "@/src/lib/api";
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
  const [memories, setMemories] = useState<MemoryRecord[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [image, setImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadMemories = async () => {
    try {
      const response = await getMemories();
      setMemories(response.memories);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load memories.");
    }
  };

  useEffect(() => {
    void loadMemories();
  }, []);

  const compressImage = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read image."));
      reader.onload = () => {
        const source = new Image();
        source.onerror = () => reject(new Error("Failed to process image."));
        source.onload = () => {
          const maxSize = 1400;
          const scale = Math.min(maxSize / source.width, maxSize / source.height, 1);
          const width = Math.max(1, Math.round(source.width * scale));
          const height = Math.max(1, Math.round(source.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d");

          if (!context) {
            reject(new Error("Image processing is unavailable."));
            return;
          }

          context.drawImage(source, 0, 0, width, height);
          let quality = 0.82;
          let result = canvas.toDataURL("image/jpeg", quality);

          while (result.length > 1_500_000 && quality > 0.45) {
            quality -= 0.08;
            result = canvas.toDataURL("image/jpeg", quality);
          }

          resolve(result);
        };
        source.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedImage = await compressImage(file);
      setImage(compressedImage);
      toast.success("Photo added.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add photo.");
    } finally {
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSaving(true);
    try {
      const response = await createMemory({
        title,
        description,
        date: date.toISOString(),
        image: image || undefined,
      });

      setMemories((current) => [response.memory, ...(current ?? [])]);
      toast.success("Memory saved to your timeline!");
      setTitle("");
      setDescription("");
      setDate(new Date());
      setImage(null);
      setShowForm(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save memory.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await deleteMemory(id);
      setMemories((current) => (current ?? []).filter((memory) => memory.id !== id));
      toast.success("Memory removed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete memory.");
    }
  };

  if (!memories) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-full bg-[#F1F7FF] p-6 shadow-[0_10px_24px_rgba(91,141,239,0.12)]">
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
                  className="flex-1 rounded-[20px] border-primary/20 font-serif text-base font-black tracking-[0.06em] text-[#111111]"
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
                  className="flex-1 rounded-[20px] bg-primary px-5 py-3 font-serif text-base font-black tracking-[0.08em] text-[#111111] shadow-[0_14px_28px_rgba(91,141,239,0.3)] transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_18px_34px_rgba(91,141,239,0.34)] disabled:translate-y-0 disabled:bg-primary/70 disabled:text-[#111111] disabled:opacity-100"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="mr-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/25">
                      <Loader2 className="animate-spin" size={18} strokeWidth={2.5} />
                    </span>
                  ) : (
                    <span className="mr-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/25">
                      <Sparkles size={18} strokeWidth={2.5} />
                    </span>
                  )}
                  Save Memory
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
                    <CardTitle className="text-xl font-serif font-black tracking-[0.02em] text-primary">
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
                      <AlertDialogContent className="rounded-3xl border-2 border-[#E7BCC7] bg-[#FFF7F8] shadow-[0_24px_60px_rgba(214,118,141,0.16)]">
                        <AlertDialogHeader>
                          <div className="mb-2 inline-flex w-fit rounded-full bg-[#F9DDE5] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#B66278]">
                            Warning
                          </div>
                          <AlertDialogTitle className="font-serif text-2xl text-[#A6566B]">
                            Delete Memory?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="rounded-[20px] border border-[#E9C7D0] bg-white/85 p-4 text-left italic font-serif text-[#875C68]">
                            This beautiful moment will be removed from your timeline.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl border-[#DFC0C8] font-serif font-semibold text-[#1F2A44]">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteMemory(memory.id)}
                            className="rounded-xl border border-[#D89CAC] bg-[#EFB6C3] px-5 font-serif text-base font-black tracking-[0.04em] text-[#6A2F40] shadow-[0_12px_24px_rgba(214,118,141,0.16)] hover:bg-[#E9A8B8]"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/60">
                    {format(parseISO(memory.date), "MMMM do, yyyy")}
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
