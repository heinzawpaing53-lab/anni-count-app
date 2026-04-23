import { differenceInDays, differenceInYears, format, parseISO } from "date-fns";
import {
  Cake,
  Camera,
  ChevronLeft,
  ChevronRight,
  Heart,
  Pencil,
  Save,
  Trash2,
  Upload,
  UserRound,
  Venus,
  Mars,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSetting, setSetting } from "@/src/db";
import { useAuth } from "@/src/context/AuthContext";

type HomeCustomization = {
  heroPhotos: string[];
  partnerOneAvatar: string | null;
  partnerTwoAvatar: string | null;
  partnerOneBirthday: string;
  partnerTwoBirthday: string;
};

const defaultCustomization: HomeCustomization = {
  heroPhotos: [],
  partnerOneAvatar: null,
  partnerTwoAvatar: null,
  partnerOneBirthday: "",
  partnerTwoBirthday: "",
};

const MAX_HERO_PHOTOS = 5;

function getCustomizationKey(userId: string) {
  return `home-customization-${userId}`;
}

function getZodiacSign(birthday: string) {
  if (!birthday) return null;

  const date = new Date(birthday);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  return "Capricorn";
}

function getAge(birthday: string) {
  if (!birthday) return null;
  return differenceInYears(new Date(), new Date(birthday));
}

function formatBirthday(birthday: string) {
  if (!birthday) return "Add birth date";
  return format(new Date(birthday), "MMMM do, yyyy");
}

function CoupleHeartCounter({ daysTogether }: { daysTogether: number | null }) {
  return (
    <div className="relative flex h-[250px] w-[250px] items-center justify-center md:h-[280px] md:w-[280px]">
      <motion.svg
        viewBox="0 0 240 220"
        className="absolute inset-0 h-full w-full"
        animate={{ scale: [1, 1.04, 0.98, 1.02, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M120 205C56 160 22 116 22 68C22 38 45 18 74 18C93 18 109 27 120 43C131 27 147 18 166 18C195 18 218 38 218 68C218 116 184 160 120 205Z"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.88)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </motion.svg>

      <div className="relative z-10 flex max-w-[175px] flex-col items-center text-center text-white md:max-w-[195px]">
        <span className="font-serif text-[1.45rem] font-semibold italic tracking-[0.03em] text-white/95">
          In Love
        </span>
        <span className="mt-4 font-serif text-6xl font-bold leading-none tracking-tight drop-shadow-[0_8px_18px_rgba(15,18,32,0.28)] md:text-7xl">
          {daysTogether ?? "-"}
        </span>
        <span className="mt-3 font-serif text-[1.45rem] font-semibold italic text-white/95">
          Days
        </span>
      </div>
    </div>
  );
}

function ProfileBadge({
  label,
  icon,
}: {
  label: string;
  icon: "mars" | "venus";
}) {
  const Icon = icon === "mars" ? Mars : Venus;

  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#4F8DFD,#7EC8E3)] px-3 py-1.5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(79,141,253,0.22)] dark:bg-[linear-gradient(135deg,#60A5FA,#7EC8E3)]">
      <Icon size={14} />
      {label}
    </span>
  );
}

export function Home() {
  const { user, updateProfile } = useAuth();
  const startDate = user?.anniversaryDate || null;
  const daysTogether = startDate ? differenceInDays(new Date(), parseISO(startDate)) + 1 : null;

  const [customization, setCustomization] = useState<HomeCustomization>(defaultCustomization);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showEditor, setShowEditor] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editorNames, setEditorNames] = useState({
    name: user?.name ?? "",
    partnerName: user?.partnerName ?? "",
  });

  const heroInputRef = useRef<HTMLInputElement>(null);
  const avatarOneInputRef = useRef<HTMLInputElement>(null);
  const avatarTwoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditorNames({
      name: user?.name ?? "",
      partnerName: user?.partnerName ?? "",
    });
  }, [user?.name, user?.partnerName]);

  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    const loadCustomization = async () => {
      const saved = await getSetting(getCustomizationKey(user.id), defaultCustomization);
      if (!isMounted) return;

      const nextCustomization = {
        ...defaultCustomization,
        ...(saved as Partial<HomeCustomization>),
      };

      setCustomization(nextCustomization);
      setActivePhotoIndex((current) => {
        if (!nextCustomization.heroPhotos.length) return 0;
        return Math.min(current, nextCustomization.heroPhotos.length - 1);
      });
    };

    void loadCustomization();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const currentHeroPhoto = customization.heroPhotos[activePhotoIndex] ?? null;

  const partnerOneMeta = useMemo(() => {
    const age = getAge(customization.partnerOneBirthday);
    const zodiac = getZodiacSign(customization.partnerOneBirthday);
    return {
      age,
      zodiac,
      birthday: formatBirthday(customization.partnerOneBirthday),
    };
  }, [customization.partnerOneBirthday]);

  const partnerTwoMeta = useMemo(() => {
    const age = getAge(customization.partnerTwoBirthday);
    const zodiac = getZodiacSign(customization.partnerTwoBirthday);
    return {
      age,
      zodiac,
      birthday: formatBirthday(customization.partnerTwoBirthday),
    };
  }, [customization.partnerTwoBirthday]);

  const saveCustomization = async (nextCustomization: HomeCustomization) => {
    if (!user?.id) return;
    await setSetting(getCustomizationKey(user.id), nextCustomization);
    setCustomization(nextCustomization);
  };

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
          let quality = 0.84;
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

  const handleHeroPhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    try {
      const remainingSlots = Math.max(0, MAX_HERO_PHOTOS - customization.heroPhotos.length);
      const prepared = await Promise.all(files.slice(0, remainingSlots).map(compressImage));
      const nextHeroPhotos = [...customization.heroPhotos, ...prepared].slice(0, MAX_HERO_PHOTOS);
      const nextCustomization = { ...customization, heroPhotos: nextHeroPhotos };
      await saveCustomization(nextCustomization);
      setActivePhotoIndex(nextHeroPhotos.length ? nextHeroPhotos.length - 1 : 0);
      toast.success("Couple photo updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload photo.");
    } finally {
      event.target.value = "";
    }
  };

  const handleAvatarUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    partnerKey: "partnerOneAvatar" | "partnerTwoAvatar"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const image = await compressImage(file);
      const nextCustomization = { ...customization, [partnerKey]: image };
      await saveCustomization(nextCustomization);
      toast.success("Profile photo updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload profile photo.");
    } finally {
      event.target.value = "";
    }
  };

  const handleRemoveCurrentHeroPhoto = async () => {
    if (!customization.heroPhotos.length) return;
    const nextHeroPhotos = customization.heroPhotos.filter((_, index) => index !== activePhotoIndex);
    const nextCustomization = { ...customization, heroPhotos: nextHeroPhotos };
    await saveCustomization(nextCustomization);
    setActivePhotoIndex((current) => Math.max(0, Math.min(current, nextHeroPhotos.length - 1)));
    toast.success("Photo removed.");
  };

  const handleSaveProfileDetails = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await updateProfile({
        name: editorNames.name,
        partnerName: editorNames.partnerName,
      });

      await saveCustomization(customization);
      toast.success("Home profile updated.");
      setShowEditor(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save home profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const nextPhoto = () => {
    if (customization.heroPhotos.length < 2) return;
    setActivePhotoIndex((current) => (current + 1) % customization.heroPhotos.length);
  };

  const previousPhoto = () => {
    if (customization.heroPhotos.length < 2) return;
    setActivePhotoIndex((current) =>
      current === 0 ? customization.heroPhotos.length - 1 : current - 1
    );
  };

  return (
    <div className="min-h-full space-y-6">
      <section className="relative overflow-hidden rounded-[36px] bg-card shadow-[0_20px_50px_rgba(84,126,160,0.16)] ring-1 ring-border/70 dark:bg-[#111827] dark:shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <div className="relative h-[470px] overflow-hidden sm:h-[520px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroPhoto ?? "empty-hero"}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {currentHeroPhoto ? (
                <img
                  src={currentHeroPhoto}
                  alt="Couple memory"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-[linear-gradient(160deg,#7EC8E3,#BFE9FF)] text-center text-white dark:bg-[linear-gradient(160deg,#16304D,#2B4F79)]">
                  <Heart className="mb-4 h-12 w-12 fill-white/35 text-white" />
                  <p className="font-serif text-2xl font-semibold">Add your first couple photo</p>
                  <p className="mt-2 max-w-[240px] text-sm text-white/85">
                    Build your romantic dashboard with beautiful shared memories.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-b from-[#081224]/14 via-transparent to-[#081224]/42 dark:from-[#081224]/24 dark:via-transparent dark:to-[#081224]/58" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/22 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
              <Heart className="h-3.5 w-3.5 fill-[#FF4D6D] text-[#FF4D6D]" />
              Heart Count
            </div>

            <Button
              type="button"
              variant="ghost"
              className="h-11 rounded-full bg-white/20 px-4 text-white hover:bg-white/30"
              onClick={() => setShowEditor((current) => !current)}
            >
              <Pencil className="mr-2" size={16} />
              {showEditor ? "Close" : "Edit"}
            </Button>
          </div>

          <div className="absolute inset-x-0 top-20 flex justify-center">
            <CoupleHeartCounter daysTogether={daysTogether} />
          </div>

          {customization.heroPhotos.length > 1 && (
            <>
              <Button
                type="button"
                variant="ghost"
                className="absolute left-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-white/18 p-0 text-white hover:bg-white/28"
                onClick={previousPhoto}
              >
                <ChevronLeft size={20} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="absolute right-4 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-white/18 p-0 text-white hover:bg-white/28"
                onClick={nextPhoto}
              >
                <ChevronRight size={20} />
              </Button>
            </>
          )}

          <div className="absolute -bottom-12 left-1/2 h-[160px] w-[135%] -translate-x-1/2 rounded-t-[55%] bg-white dark:bg-[#111827]" />
        </div>

        <div className="relative z-10 -mt-4 rounded-t-[42px] bg-white px-5 pb-7 pt-1 dark:bg-[#111827]">
          <div className="flex items-start justify-between gap-3">
            <PartnerProfile
              side="left"
              avatar={customization.partnerOneAvatar}
              fallbackName={user?.name ?? "You"}
              birthday={partnerOneMeta.birthday}
              age={partnerOneMeta.age}
              zodiac={partnerOneMeta.zodiac}
              onUploadClick={() => avatarOneInputRef.current?.click()}
            />

            <motion.div
              animate={{ scale: [1, 1.22, 1.06, 1.18, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-16 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_16px_32px_rgba(126,200,227,0.24)] ring-1 ring-primary/10 dark:bg-[#0F1726] dark:shadow-[0_18px_30px_rgba(0,0,0,0.26)]"
            >
              <Heart className="h-9 w-9 fill-[#FF4D6D] text-[#FF4D6D]" />
            </motion.div>

            <PartnerProfile
              side="right"
              avatar={customization.partnerTwoAvatar}
              fallbackName={user?.partnerName ?? "Partner"}
              birthday={partnerTwoMeta.birthday}
              age={partnerTwoMeta.age}
              zodiac={partnerTwoMeta.zodiac}
              onUploadClick={() => avatarTwoInputRef.current?.click()}
            />
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showEditor && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="romantic-surface space-y-6 border border-primary/14 bg-card/92 p-6 shadow-[0_18px_44px_rgba(84,126,160,0.14)] dark:bg-[#111827]"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-foreground">Customize Home</h2>
                <p className="text-sm italic text-muted-foreground">
                  Update your shared photos, names, and birthdays.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setShowEditor(false)}
              >
                <X size={18} />
              </Button>
            </div>

            <div className="grid gap-5">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-[0.18em] text-primary/70">
                  Couple Photos
                </Label>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-[18px] border-primary/20 bg-white/90 font-serif dark:bg-[#0F1726]"
                    onClick={() => heroInputRef.current?.click()}
                  >
                    <Upload className="mr-2" size={16} />
                    Add Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-[18px] border-primary/20 bg-white/90 font-serif dark:bg-[#0F1726]"
                    onClick={handleRemoveCurrentHeroPhoto}
                    disabled={!customization.heroPhotos.length}
                  >
                    <Trash2 className="mr-2" size={16} />
                    Remove Current
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Up to {MAX_HERO_PHOTOS} offline photos. Use the dots on the hero section to switch between them.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-[0.18em] text-primary/70">
                    Partner 1
                  </Label>
                  <Input
                    value={editorNames.name}
                    onChange={(event) =>
                      setEditorNames((current) => ({ ...current, name: event.target.value }))
                    }
                    className="h-11 rounded-[18px] bg-white/90 dark:bg-[#0F1726]"
                    placeholder="First partner name"
                  />
                  <Input
                    type="date"
                    value={customization.partnerOneBirthday}
                    onChange={(event) =>
                      setCustomization((current) => ({
                        ...current,
                        partnerOneBirthday: event.target.value,
                      }))
                    }
                    className="h-11 rounded-[18px] bg-white/90 dark:bg-[#0F1726]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-[18px] border-primary/20 bg-white/90 font-serif dark:bg-[#0F1726]"
                    onClick={() => avatarOneInputRef.current?.click()}
                  >
                    <Camera className="mr-2" size={16} />
                    Change Avatar
                  </Button>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-[0.18em] text-primary/70">
                    Partner 2
                  </Label>
                  <Input
                    value={editorNames.partnerName}
                    onChange={(event) =>
                      setEditorNames((current) => ({
                        ...current,
                        partnerName: event.target.value,
                      }))
                    }
                    className="h-11 rounded-[18px] bg-white/90 dark:bg-[#0F1726]"
                    placeholder="Second partner name"
                  />
                  <Input
                    type="date"
                    value={customization.partnerTwoBirthday}
                    onChange={(event) =>
                      setCustomization((current) => ({
                        ...current,
                        partnerTwoBirthday: event.target.value,
                      }))
                    }
                    className="h-11 rounded-[18px] bg-white/90 dark:bg-[#0F1726]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-[18px] border-primary/20 bg-white/90 font-serif dark:bg-[#0F1726]"
                    onClick={() => avatarTwoInputRef.current?.click()}
                  >
                    <Camera className="mr-2" size={16} />
                    Change Avatar
                  </Button>
                </div>
              </div>
            </div>

            <Button
              type="button"
              className="h-12 w-full rounded-[20px] bg-primary font-serif text-base font-bold text-white shadow-[0_14px_28px_rgba(126,200,227,0.24)] hover:bg-primary/90 dark:text-[#0B1220]"
              onClick={handleSaveProfileDetails}
              disabled={isSaving}
            >
              <Save className="mr-2" size={17} />
              Save Home Profile
            </Button>
          </motion.section>
        )}
      </AnimatePresence>

      <input
        ref={heroInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleHeroPhotoUpload}
      />
      <input
        ref={avatarOneInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => void handleAvatarUpload(event, "partnerOneAvatar")}
      />
      <input
        ref={avatarTwoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => void handleAvatarUpload(event, "partnerTwoAvatar")}
      />
    </div>
  );
}

function PartnerProfile({
  side,
  avatar,
  fallbackName,
  birthday,
  age,
  zodiac,
  onUploadClick,
}: {
  side: "left" | "right";
  avatar: string | null;
  fallbackName: string;
  birthday: string;
  age: number | null;
  zodiac: string | null;
  onUploadClick: () => void;
}) {
  return (
    <div className={`flex w-[43%] flex-col items-center text-center ${side === "right" ? "items-end" : "items-start"} sm:w-[40%]`}>
      <button
        type="button"
        onClick={onUploadClick}
        className="group relative mx-auto flex h-[152px] w-[152px] items-center justify-center transition-transform duration-300 hover:-translate-y-1"
      >
        <svg viewBox="0 0 120 110" className="absolute inset-0 h-full w-full drop-shadow-[0_18px_38px_rgba(126,200,227,0.24)]">
          <defs>
            <clipPath id={`partner-heart-clip-${side}`}>
              <path d="M60 101C28 79 11 58 11 35C11 20 23 10 37 10C47 10 56 15 60 24C64 15 73 10 83 10C97 10 109 20 109 35C109 58 92 79 60 101Z" />
            </clipPath>
          </defs>

          <path
            d="M60 101C28 79 11 58 11 35C11 20 23 10 37 10C47 10 56 15 60 24C64 15 73 10 83 10C97 10 109 20 109 35C109 58 92 79 60 101Z"
            fill="url(#partner-heart-gradient)"
            stroke="white"
            strokeWidth="5"
            strokeLinejoin="round"
            className="dark:stroke-[#111827]"
          />

          {avatar ? (
            <image
              href={avatar}
              x="6"
              y="7"
              width="108"
              height="99"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#partner-heart-clip-${side})`}
            />
          ) : (
            <foreignObject x="12" y="14" width="96" height="80" clipPath={`url(#partner-heart-clip-${side})`}>
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#7EC8E3,#BFE9FF)] text-white dark:bg-[linear-gradient(135deg,#60A5FA,#7EC8E3)]">
                <UserRound size={40} />
              </div>
            </foreignObject>
          )}
        </svg>

        <div className="absolute inset-x-5 bottom-6 rounded-full bg-[#081224]/55 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Upload
        </div>
      </button>

      <div className="mt-4 w-full space-y-3">
        <p className="whitespace-nowrap font-serif text-[1.85rem] font-semibold leading-none text-foreground">
          {fallbackName}
        </p>
        <p className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Cake size={14} />
          {birthday}
        </p>

        <div className="flex justify-center gap-2 whitespace-nowrap">
          {age !== null && (
            <ProfileBadge label={`${age}`} icon={side === "left" ? "mars" : "venus"} />
          )}
          {zodiac && <ProfileBadge label={zodiac} icon={side === "left" ? "mars" : "venus"} />}
        </div>
      </div>
    </div>
  );
}
