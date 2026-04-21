import { useState, type FormEvent } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Heart, LockKeyhole, Mail, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type Mode = "login" | "register";

export function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [submitting, setSubmitting] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    partnerName: "",
    anniversaryDate: "",
  });

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(loginForm);
      toast.success("Welcome back.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        email: registerForm.email,
        password: registerForm.password,
        name: registerForm.name,
        partnerName: registerForm.partnerName,
        anniversaryDate: registerForm.anniversaryDate,
      });
      setLoginForm({
        email: registerForm.email,
        password: "",
      });
      setRegisterForm({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        partnerName: "",
        anniversaryDate: "",
      });
      setMode("login");
      toast.success("Account created. Please log in.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="romantic-surface w-full max-w-md border border-primary/10 bg-[#F7FBFF] p-7">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#5B8DEF,#AFCBFF)] text-white shadow-[0_14px_30px_rgba(91,141,239,0.25)]">
            <Heart className="fill-white/35 text-white" size={28} />
          </div>
          <h1 className="font-serif text-4xl font-semibold text-primary">
            {mode === "login" ? "Log In" : "Register"}
          </h1>
          <p className="mt-2 text-sm italic text-muted-foreground">
            Sign in together, keep your memories together.
          </p>
        </div>

        {mode === "login" ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest text-primary/70">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={16} />
                <Input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((current) => ({ ...current, email: event.target.value }))
                  }
                  className="h-11 rounded-[20px] bg-white pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest text-primary/70">Password</Label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={16} />
                <Input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((current) => ({ ...current, password: event.target.value }))
                  }
                  className="h-11 rounded-[20px] bg-white pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="h-12 w-full rounded-[20px] bg-primary font-serif text-base font-black tracking-[0.08em] !text-[#1F2A44] shadow-[0_12px_24px_rgba(91,141,239,0.22)] hover:bg-primary/90 disabled:!bg-[#BFD4FB] disabled:!text-[#1F2A44] disabled:!opacity-100"
              disabled={submitting}
            >
              Login
            </Button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest text-primary/70">Your Name</Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={16} />
                <Input
                  value={registerForm.name}
                  onChange={(event) =>
                    setRegisterForm((current) => ({ ...current, name: event.target.value }))
                  }
                  className="h-11 rounded-[20px] bg-white pl-10"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest text-primary/70">
                Partner Name
              </Label>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={16} />
                <Input
                  value={registerForm.partnerName}
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      partnerName: event.target.value,
                    }))
                  }
                  className="h-11 rounded-[20px] bg-white pl-10"
                  placeholder="Partner's name"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest text-primary/70">
                Anniversary Date
              </Label>
              <Popover>
                <PopoverTrigger
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 w-full justify-start rounded-[20px] bg-white text-left font-normal"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary/60" />
                  {registerForm.anniversaryDate ? (
                    format(new Date(registerForm.anniversaryDate), "PPP")
                  ) : (
                    <span className="text-muted-foreground">Pick your anniversary date</span>
                  )}
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto rounded-[24px] border border-primary/20 bg-[#FDFEFF] p-3 shadow-[0_24px_60px_rgba(31,42,68,0.18)] ring-1 ring-primary/10"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={
                      registerForm.anniversaryDate
                        ? new Date(registerForm.anniversaryDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      date &&
                      setRegisterForm((current) => ({
                        ...current,
                        anniversaryDate: date.toISOString(),
                      }))
                    }
                    initialFocus
                    showOutsideDays={false}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest text-primary/70">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" size={16} />
                <Input
                  type="email"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm((current) => ({ ...current, email: event.target.value }))
                  }
                  className="h-11 rounded-[20px] bg-white pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest text-primary/70">Password</Label>
              <Input
                type="password"
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, password: event.target.value }))
                }
                className="h-11 rounded-[20px] bg-white"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest text-primary/70">
                Confirm Password
              </Label>
              <Input
                type="password"
                value={registerForm.confirmPassword}
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
                className="h-11 rounded-[20px] bg-white"
                placeholder="Repeat password"
                required
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full rounded-[20px] bg-primary font-serif text-base font-black tracking-[0.08em] !text-[#1F2A44] shadow-[0_12px_24px_rgba(91,141,239,0.22)] hover:bg-primary/90 disabled:!bg-[#BFD4FB] disabled:!text-[#1F2A44] disabled:!opacity-100"
              disabled={submitting}
            >
              Register
            </Button>
          </form>
        )}

        <div className="mt-6 border-t border-primary/10 pt-5 text-center">
          <p className="mb-3 text-sm text-muted-foreground">
            {mode === "login" ? "Don't have an account yet?" : "Already have an account?"}
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-full rounded-[20px] border-primary/20 font-serif"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Register" : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
