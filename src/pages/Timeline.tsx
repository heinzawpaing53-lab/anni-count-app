import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/src/db";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Heart, Trash2, Camera, Loader2, Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 gap-4">
        <div className="bg-primary/5 p-6 rounded-full">
          <CalendarIcon size={48} className="text-primary/40" />
        </div>
        <h2 className="text-2xl font-serif font-medium text-primary">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-serif font-semibold text-primary tracking-tight">Timeline</h1>
        <p className="text-muted-foreground italic font-serif">Our story, one moment at a time.</p>
      </header>

      {/* Add Memory Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-white to-primary/5 p-6 rounded-2xl shadow-lg border-2 border-primary/20 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-semibold text-primary">Create New Memory</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowForm(false)}
                className="rounded-full h-8 w-8"
              >
                <ChevronUp size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="title" className="text-xs uppercase tracking-widest font-bold text-primary/70">Title</Label>
                <Input
                  id="title"
                  placeholder="What happened today?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white border-primary/10 rounded-xl font-serif"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-widest font-bold text-primary/70">Date</Label>
                <Popover>
                  <PopoverTrigger
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full justify-start text-left font-normal bg-white border-primary/10 rounded-xl h-10",
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
                <Label htmlFor="description" className="text-xs uppercase tracking-widest font-bold text-primary/70">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell the story..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white border-primary/10 rounded-xl min-h-[100px] font-serif italic text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-widest font-bold text-primary/70">Photo (Optional)</Label>
                <div className="flex flex-col gap-3">
                  {image ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-primary/10">
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 rounded-full h-7 w-7 p-0 text-xs"
                        onClick={() => setImage(null)}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
                      <Camera className="text-primary/40 group-hover:text-primary/60 transition-colors" size={24} />
                      <span className="text-xs font-medium text-primary/40 mt-1">Add photo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-lg border-primary/20"
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
                  className="flex-1 rounded-lg bg-primary hover:bg-primary/90 text-white font-serif"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin mr-2" size={18} />
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

      {/* Add Memory Button */}
      {!showForm && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-dashed border-primary/30 hover:border-primary/50 hover:from-primary/20 hover:to-accent/20 transition-all group"
        >
          <div className="flex items-center gap-2 text-primary font-serif font-semibold">
            <Sparkles size={20} className="group-hover:scale-110 transition-transform" />
            Add New Memory
            <ChevronDown size={20} className="group-hover:scale-110 transition-transform" />
          </div>
        </motion.button>
      )}

      {/* Memories List */}
      {memories.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-6 gap-4">
          <div className="bg-primary/5 p-6 rounded-full">
            <CalendarIcon size={48} className="text-primary/40" />
          </div>
          <h2 className="text-2xl font-serif font-medium text-primary">No memories yet</h2>
          <p className="text-muted-foreground italic font-serif">
            Start capturing your beautiful moments together.
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-420px)] sm:h-[calc(100vh-450px)] pr-4">
          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary/20 before:to-transparent">
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4 sm:gap-6"
              >
                <div className="absolute left-0 mt-1.5 h-10 w-10 rounded-full border-4 border-background bg-primary flex items-center justify-center z-10 shadow-sm shrink-0">
                  <Heart size={16} className="text-white fill-white" />
                </div>

                <Card className="flex-1 ml-4 sm:ml-6 overflow-hidden border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                  {memory.image && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={memory.image}
                        alt={memory.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-serif font-semibold text-primary">
                        {memory.title}
                      </CardTitle>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
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
                              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-serif"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-primary/60">
                      {format(memory.date, "MMMM do, yyyy")}
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed italic font-serif">
                      {memory.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
