import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Gift,
  QrCode,
  Sparkles,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface LandingPageProps {
  refCode: string | null;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const featureCards = [
  {
    icon: QrCode,
    title: "Kode Unik",
    description:
      "Setiap pengguna mendapatkan kode referral eksklusif yang unik sebagai identitas mereka.",
  },
  {
    icon: BarChart3,
    title: "Lacak Referral",
    description:
      "Pantau berapa banyak teman yang sudah bergabung lewat kode referralmu secara real-time.",
  },
  {
    icon: Users,
    title: "Leaderboard",
    description:
      "Bersaing dengan pengguna lain dan jadilah yang teratas di papan peringkat referral.",
  },
];

export default function LandingPage({ refCode }: LandingPageProps) {
  const { login, isLoggingIn } = useInternetIdentity();

  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav bar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <div className="glass-card border-b border-border/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/refshare-logo-transparent.dim_120x120.png"
                alt="RefShare Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-display font-bold text-lg text-foreground">
                Ref<span className="text-gold">Share</span>
              </span>
            </div>
            <Button
              data-ocid="nav.login_button"
              variant="outline"
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="border-primary/40 text-primary hover:bg-primary/10 hover:border-primary transition-all"
            >
              {isLoggingIn ? "Memuat..." : "Masuk"}
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* Referral invite banner */}
        <AnimatePresence>
          {refCode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="glass-card-gold border-y border-primary/30 py-3">
                <div className="container mx-auto px-4 flex items-center gap-3">
                  <Gift className="w-5 h-5 text-primary flex-shrink-0 animate-float" />
                  <p className="text-sm font-body">
                    <span className="text-foreground font-medium">
                      Kamu diundang oleh seseorang!
                    </span>{" "}
                    <span className="text-muted-foreground">
                      Daftar sekarang untuk mendukung mereka dan dapatkan
                      manfaatnya.
                    </span>
                  </p>
                  <span className="ml-auto text-xs font-mono text-primary/70 font-medium bg-primary/10 px-2 py-1 rounded-md flex-shrink-0">
                    {refCode}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                "url('/assets/generated/hero-bg.dim_1600x800.jpg')",
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />

          <div className="relative container mx-auto px-4 py-24 md:py-36">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-3xl mx-auto text-center"
            >
              {/* Pill badge */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center mb-6"
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium font-body border border-primary/30 bg-primary/10 text-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  Program Referral Eksklusif
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={itemVariants}
                className="font-display font-bold text-5xl md:text-7xl leading-[1.05] tracking-tight mb-6"
              >
                Bagikan &{" "}
                <span className="relative inline-block">
                  <span className="rank-gold">Dapatkan</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 w-full h-0.5 gold-gradient rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
                  />
                </span>{" "}
                Reward!
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed mb-10 max-w-xl mx-auto"
              >
                Undang teman-temanmu dan kumpulkan poin untuk setiap orang yang
                bergabung lewat kode referralmu. Semakin banyak, semakin tinggi
                peringkatmu!
              </motion.p>

              {/* CTA Button */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center"
              >
                <Button
                  data-ocid="landing.primary_button"
                  size="lg"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="relative h-14 px-8 text-base font-display font-semibold gold-gradient text-primary-foreground border-0 hover:opacity-90 transition-all duration-300 shadow-gold group animate-pulse-gold"
                >
                  {isLoggingIn ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                      Menghubungkan...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Daftar / Masuk Sekarang
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* Trust indicator */}
              <motion.p
                variants={itemVariants}
                className="mt-4 text-xs text-muted-foreground font-body"
              >
                Aman & terdesentralisasi menggunakan Internet Identity
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="container mx-auto px-4 pb-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {featureCards.map((card, i) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-6 group relative overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-4 group-hover:border-primary/50 transition-colors">
                    <card.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Rank badge */}
                <div className="absolute top-4 right-4 text-2xl font-display font-black opacity-5">
                  {i + 1}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm font-body">
            © {year}. Dibuat dengan <span className="text-gold">♥</span>{" "}
            menggunakan{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
