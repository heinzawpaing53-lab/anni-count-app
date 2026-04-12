import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/src/db";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "motion/react";
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

export function Timeline() {
  const memories = useLiveQuery(() => db.memories.orderBy("date").reverse().toArray());

  const deleteMemory = async (id: number) => {
    try {
      await db.memories.delete(id);
      toast.success("Memory removed.");
    } catch (error) {
      toast.error("Failed to delete memory.");
    }
  };

  if (!memories || memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 gap-4">
        <div className="bg-primary/5 p-6 rounded-full">
          <CalendarIcon size={48} className="text-primary/40" />
        </div>
        <h2 className="text-2xl font-serif font-medium text-primary">No memories yet</h2>
        <p className="text-muted-foreground italic font-serif">
          Start capturing your beautiful moments together.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-serif font-semibold text-primary tracking-tight">Timeline</h1>
        <p className="text-muted-foreground italic font-serif">Our story, one moment at a time.</p>
      </header>

      <ScrollArea className="h-[calc(100vh-220px)] sm:h-[calc(100vh-250px)] pr-4">
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
    </div>
  );
}
