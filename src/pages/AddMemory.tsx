import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/src/db";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Camera, Loader2, Sparkles, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AddMemory() {
  const navigate = useNavigate();
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
      navigate("/timeline");
    } catch (error) {
      console.error("Failed to save memory:", error);
      toast.error("Failed to save memory. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-semibold text-primary tracking-tight">New Memory</h1>
          <p className="text-muted-foreground italic font-serif">Capture a moment to keep forever.</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-10 w-10"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={24} />
        </Button>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-xs uppercase tracking-widest font-bold text-primary/70">Title</Label>
          <Input
            id="title"
            placeholder="What happened today?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white border-primary/10 rounded-xl font-serif text-lg"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest font-bold text-primary/70">Date</Label>
          <Popover>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-start text-left font-normal bg-white border-primary/10 rounded-xl h-12",
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
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs uppercase tracking-widest font-bold text-primary/70">Description</Label>
          <Textarea
            id="description"
            placeholder="Tell the story..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white border-primary/10 rounded-xl min-h-[120px] font-serif italic"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest font-bold text-primary/70">Photo (Optional)</Label>
          <div className="flex flex-col gap-4">
            {image ? (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-primary/10">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 rounded-full h-8 w-8 p-0"
                  onClick={() => setImage(null)}
                >
                  ×
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/20 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
                <Camera className="text-primary/40 group-hover:text-primary/60 transition-colors" size={32} />
                <span className="text-xs font-medium text-primary/40 mt-2">Add a photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-14 rounded-2xl text-lg font-serif font-medium shadow-lg shadow-primary/20"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Sparkles className="mr-2" size={20} />
          )}
          Save Memory
        </Button>
      </form>
    </div>
  );
}
