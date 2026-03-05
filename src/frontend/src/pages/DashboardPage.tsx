import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Copy,
  Crown,
  Loader2,
  Share2,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  useIsRegistered,
  useMyProfile,
  useRegister,
} from "../hooks/useQueries";
import LeaderboardSection from "./LeaderboardSection";

interface DashboardPageProps {
  activeTab: "dashboard" | "leaderboard";
  onTabChange: (tab: "dashboard" | "leaderboard") => void;
  pendingRefCode: string | null;
  onRefCodeConsumed: () => void;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

export default function DashboardPage({
  activeTab,
  onTabChange,
  pendingRefCode,
  onRefCodeConsumed,
}: DashboardPageProps) {
  const { data: isRegistered, isLoading: checkingRegistration } =
    useIsRegistered();
  const { data: profile, isLoading: loadingProfile } = useMyProfile();
  const {
    mutate: register,
    isPending: registering,
    isError: registerError,
  } = useRegister();
  const hasRegistered = useRef(false);

  // Auto-register once after login if not yet registered
  useEffect(() => {
    if (isRegistered === false && !registering && !hasRegistered.current) {
      hasRegistered.current = true;
      register(pendingRefCode, {
        onSuccess: () => {
          onRefCodeConsumed();
          toast.success("Berhasil terdaftar! Selamat datang di RefShare 🎉");
        },
      });
    }
  }, [isRegistered, registering, pendingRefCode, register, onRefCodeConsumed]);

  const isLoading = checkingRegistration || loadingProfile || registering;

  if (activeTab === "leaderboard") {
    return (
      <LeaderboardSection onTabChange={onTabChange} currentProfile={profile} />
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <AnimatePresence mode="wait">
        {registering && (
          <motion.div
            key="registering"
            data-ocid="register.loading_state"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 glass-card-gold rounded-xl p-4 flex items-center gap-3"
          >
            <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Mendaftarkan akunmu...
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ini hanya sekali, mohon tunggu sebentar
              </p>
            </div>
          </motion.div>
        )}

        {registerError && !registering && (
          <motion.div
            key="register-error"
            data-ocid="register.error_state"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 glass-card rounded-xl p-4 flex items-center gap-3 border-destructive/40"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">
                Registrasi gagal
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Coba muat ulang halaman
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <DashboardSkeleton />
      ) : profile ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              Dashboard Referral
            </h1>
            <p className="text-muted-foreground font-body mt-2">
              Bagikan kode unikmu dan lacak perkembanganmu
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats card - full width on mobile, 1 col on md */}
            <motion.div
              variants={itemVariants}
              data-ocid="dashboard.stats_card"
              className="glass-card-gold rounded-2xl p-6 flex flex-col items-center justify-center text-center animate-pulse-gold"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-3">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <p className="text-5xl font-display font-black rank-gold mb-1">
                {profile.referralCount.toString()}
              </p>
              <p className="text-sm font-body text-muted-foreground">
                Total Referral
              </p>
              {Number(profile.referralCount) >= 5 && (
                <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25">
                  <Crown className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs text-primary font-medium">
                    Top Referrer
                  </span>
                </div>
              )}
            </motion.div>

            {/* Referral code + link */}
            <motion.div
              variants={itemVariants}
              className="md:col-span-2 space-y-4"
            >
              {/* Referral Code */}
              <div className="glass-card rounded-2xl p-6">
                <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  Kode Referral Kamu
                </p>
                <div className="flex items-center gap-3">
                  <div
                    data-ocid="dashboard.referral_code_input"
                    className="flex-1 font-mono text-2xl md:text-3xl font-bold tracking-[0.15em] text-primary select-all bg-primary/8 border border-primary/25 rounded-xl px-4 py-3 text-center"
                    aria-label="Kode referral kamu"
                  >
                    {profile.referralCode}
                  </div>
                  <Button
                    data-ocid="dashboard.copy_code_button"
                    size="icon"
                    variant="outline"
                    className="h-12 w-12 rounded-xl border-border/60 hover:border-primary/50 hover:bg-primary/10 flex-shrink-0"
                    onClick={() => {
                      navigator.clipboard.writeText(profile.referralCode);
                      toast.success("Kode referral disalin!");
                    }}
                    aria-label="Salin kode referral"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Referral Link */}
              <div className="glass-card rounded-2xl p-6">
                <p className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-3">
                  Link Referral
                </p>
                <ReferralLinkShare referralCode={profile.referralCode} />
              </div>

              {/* Join date */}
              <div className="glass-card rounded-xl px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-muted/80 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-body">
                    Bergabung sejak
                  </p>
                  <p className="text-sm font-medium text-foreground font-body">
                    {formatJoinDate(profile.joinTime)}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick action to leaderboard */}
          <motion.div variants={itemVariants} className="mt-8">
            <button
              type="button"
              data-ocid="nav.leaderboard_link"
              onClick={() => onTabChange("leaderboard")}
              className="w-full glass-card rounded-2xl p-5 flex items-center gap-4 group hover:border-primary/30 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-colors flex-shrink-0">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground font-body">
                  Lihat Leaderboard
                </p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">
                  Lihat posisimu di antara pengguna terbaik
                </p>
              </div>
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Chevron right</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </div>
  );
}

function ReferralLinkShare({ referralCode }: { referralCode: string }) {
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Link referral disalin!");
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Bergabunglah dengan RefShare!",
          text: `Gunakan kode referralku: ${referralCode} dan dapatkan reward bersama!`,
          url: referralLink,
        });
      } catch {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 bg-muted/40 border border-border/60 rounded-xl px-4 py-3 group">
        <p
          className="flex-1 text-sm font-mono text-muted-foreground truncate select-all"
          title={referralLink}
        >
          {referralLink}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          data-ocid="dashboard.copy_link_button"
          variant="outline"
          size="sm"
          onClick={copyLink}
          className="flex-1 border-border/60 hover:border-primary/50 hover:bg-primary/10 transition-all"
        >
          <Copy className="w-3.5 h-3.5 mr-2" />
          Salin Link
        </Button>
        <Button
          data-ocid="dashboard.share_button"
          size="sm"
          onClick={shareLink}
          className="flex-1 gold-gradient text-primary-foreground border-0 hover:opacity-90 transition-opacity"
        >
          <Share2 className="w-3.5 h-3.5 mr-2" />
          Bagikan
        </Button>
      </div>
    </div>
  );
}

function formatJoinDate(timestamp: bigint): string {
  // Motoko Time is in nanoseconds
  const ms = Number(timestamp / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-56 mb-2 bg-muted/50" />
        <Skeleton className="h-5 w-80 bg-muted/50" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-44 rounded-2xl bg-muted/50" />
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-28 rounded-2xl bg-muted/50" />
          <Skeleton className="h-28 rounded-2xl bg-muted/50" />
          <Skeleton className="h-14 rounded-xl bg-muted/50" />
        </div>
      </div>
      <Skeleton className="h-16 rounded-2xl bg-muted/50" />
    </div>
  );
}
