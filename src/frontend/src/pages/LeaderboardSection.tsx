import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Award,
  Crown,
  Medal,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import type { UserProfile } from "../backend.d";
import { useLeaderboard } from "../hooks/useQueries";

interface LeaderboardSectionProps {
  onTabChange: (tab: "dashboard" | "leaderboard") => void;
  currentProfile?: UserProfile;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

function maskCode(code: string): string {
  if (code.length <= 3) return `${code}***`;
  return `${code.slice(0, 3)}***`;
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
  return (
    <span className="text-muted-foreground font-mono text-sm font-bold">
      #{rank}
    </span>
  );
}

function getRankClass(rank: number): string {
  if (rank === 1) return "rank-gold";
  if (rank === 2) return "rank-silver";
  if (rank === 3) return "rank-bronze";
  return "";
}

function getRankRowClass(rank: number): string {
  if (rank === 1) return "bg-primary/8 border-l-2 border-l-primary/60";
  if (rank === 2) return "bg-muted/20 border-l-2 border-l-muted-foreground/30";
  if (rank === 3) return "bg-accent/5 border-l-2 border-l-accent/30";
  return "";
}

// Sample leaderboard entries to show when no data
const sampleLeaderboard: UserProfile[] = [
  {
    referralCode: "SULTAN",
    joinTime: BigInt(1740000000000000000),
    referralCount: BigInt(47),
  },
  {
    referralCode: "MASTER",
    joinTime: BigInt(1740100000000000000),
    referralCount: BigInt(32),
  },
  {
    referralCode: "HACKER",
    joinTime: BigInt(1740200000000000000),
    referralCount: BigInt(28),
  },
  {
    referralCode: "LEGEND",
    joinTime: BigInt(1740300000000000000),
    referralCount: BigInt(19),
  },
  {
    referralCode: "PROREF",
    joinTime: BigInt(1740400000000000000),
    referralCount: BigInt(15),
  },
  {
    referralCode: "ROCKET",
    joinTime: BigInt(1740500000000000000),
    referralCount: BigInt(11),
  },
];

export default function LeaderboardSection({
  onTabChange,
  currentProfile,
}: LeaderboardSectionProps) {
  const { data: leaderboard, isLoading } = useLeaderboard();

  const entries =
    leaderboard && leaderboard.length > 0 ? leaderboard : sampleLeaderboard;
  const isUsingDemo = !leaderboard || leaderboard.length === 0;

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTabChange("dashboard")}
            className="text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Kembali
          </Button>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center flex-shrink-0 shadow-gold">
            <Trophy className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              Leaderboard
            </h1>
            <p className="text-muted-foreground font-body mt-1">
              Pengguna dengan referral terbanyak
            </p>
          </div>
        </div>
      </motion.div>

      {/* Top 3 podium */}
      {!isLoading && entries.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {/* 2nd place */}
          <PodiumCard
            entry={entries[1]}
            rank={2}
            isCurrent={
              currentProfile?.referralCode === entries[1]?.referralCode
            }
          />
          {/* 1st place - center, elevated */}
          <PodiumCard
            entry={entries[0]}
            rank={1}
            elevated
            isCurrent={
              currentProfile?.referralCode === entries[0]?.referralCode
            }
          />
          {/* 3rd place */}
          <PodiumCard
            entry={entries[2]}
            rank={3}
            isCurrent={
              currentProfile?.referralCode === entries[2]?.referralCode
            }
          />
        </motion.div>
      )}

      {/* Full table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        {isLoading ? (
          <div className="p-6 space-y-3">
            {(["a", "b", "c", "d", "e", "f"] as const).map((id) => (
              <Skeleton key={id} className="h-12 rounded-lg bg-muted/50" />
            ))}
          </div>
        ) : (
          <Table data-ocid="leaderboard.table">
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-16 font-body text-muted-foreground font-medium">
                  Rank
                </TableHead>
                <TableHead className="font-body text-muted-foreground font-medium">
                  Kode
                </TableHead>
                <TableHead className="text-right font-body text-muted-foreground font-medium">
                  <span className="flex items-center justify-end gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Referral
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <motion.tbody
                className="contents"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {entries.map((entry, index) => {
                  const rank = index + 1;
                  const isCurrentUser =
                    currentProfile?.referralCode === entry.referralCode;
                  const dataOcid =
                    rank <= 3
                      ? (`leaderboard.item.${rank}` as const)
                      : undefined;

                  return (
                    <motion.tr
                      key={entry.referralCode}
                      variants={rowVariants}
                      data-ocid={dataOcid}
                      className={`border-border/30 transition-colors ${getRankRowClass(rank)} ${
                        isCurrentUser ? "ring-1 ring-primary/40 ring-inset" : ""
                      }`}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(rank)}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono font-bold text-base tracking-wider ${
                              rank <= 3 ? getRankClass(rank) : "text-foreground"
                            }`}
                          >
                            {maskCode(entry.referralCode)}
                          </span>
                          {isCurrentUser && (
                            <span className="text-xs font-body text-primary bg-primary/15 border border-primary/30 px-2 py-0.5 rounded-full">
                              Kamu
                            </span>
                          )}
                          {isUsingDemo && rank === 1 && (
                            <span className="text-xs font-body text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                              demo
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <span
                          className={`font-display font-bold text-lg ${
                            rank === 1
                              ? "rank-gold"
                              : rank === 2
                                ? "rank-silver"
                                : rank === 3
                                  ? "rank-bronze"
                                  : "text-foreground"
                          }`}
                        >
                          {entry.referralCount.toString()}
                        </span>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </TableBody>
          </Table>
        )}
      </motion.div>

      {isUsingDemo && !isLoading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground font-body mt-4"
        >
          * Data contoh ditampilkan. Daftar dan undang teman untuk muncul di
          sini!
        </motion.p>
      )}
    </div>
  );
}

interface PodiumCardProps {
  entry: UserProfile;
  rank: 1 | 2 | 3;
  elevated?: boolean;
  isCurrent?: boolean;
}

function PodiumCard({
  entry,
  rank,
  elevated = false,
  isCurrent = false,
}: PodiumCardProps) {
  const borderClass =
    rank === 1
      ? "border-primary/40 shadow-gold"
      : rank === 2
        ? "border-muted-foreground/20"
        : "border-accent/20";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative glass-card rounded-2xl p-4 text-center flex flex-col items-center gap-2 border ${borderClass} ${
        elevated ? "-mt-4 pb-6" : "mt-4"
      } ${isCurrent ? "ring-1 ring-primary/40 ring-offset-1 ring-offset-background" : ""}`}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        {rank === 1 && (
          <Crown className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
        )}
        {rank === 2 && <Medal className="w-5 h-5 text-slate-400" />}
        {rank === 3 && <Award className="w-5 h-5 text-amber-600" />}
      </div>

      <span
        className={`font-mono font-black text-xl tracking-widest mt-2 ${getRankClass(rank)}`}
      >
        {maskCode(entry.referralCode)}
      </span>

      <span className={`font-display font-bold text-3xl ${getRankClass(rank)}`}>
        {entry.referralCount.toString()}
      </span>
      <span className="text-xs text-muted-foreground font-body">referral</span>

      {isCurrent && (
        <span className="text-xs font-body text-primary bg-primary/15 border border-primary/30 px-2 py-0.5 rounded-full">
          Kamu
        </span>
      )}
    </motion.div>
  );
}
