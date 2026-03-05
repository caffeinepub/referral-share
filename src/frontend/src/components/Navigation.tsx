import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface NavigationProps {
  activeTab: "dashboard" | "leaderboard";
  onTabChange: (tab: "dashboard" | "leaderboard") => void;
}

export default function Navigation({
  activeTab,
  onTabChange,
}: NavigationProps) {
  const { clear, isLoggingIn } = useInternetIdentity();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="glass-card border-b border-border/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
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

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <button
              type="button"
              data-ocid="nav.dashboard_link"
              onClick={() => onTabChange("dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 ${
                activeTab === "dashboard"
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              type="button"
              data-ocid="nav.leaderboard_link"
              onClick={() => onTabChange("leaderboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 ${
                activeTab === "leaderboard"
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </button>
          </nav>

          {/* Logout */}
          <Button
            data-ocid="nav.logout_button"
            variant="outline"
            size="sm"
            onClick={clear}
            disabled={isLoggingIn}
            className="border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
