import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import {
  getSessionParameter,
  getUrlParameter,
  storeSessionParameter,
} from "./utils/urlParams";

const REF_CODE_KEY = "pendingReferralCode";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState<"dashboard" | "leaderboard">(
    "dashboard",
  );
  const [refCode, setRefCode] = useState<string | null>(null);

  // Capture referral code from URL on mount
  useEffect(() => {
    const urlRef = getUrlParameter("ref");
    if (urlRef) {
      storeSessionParameter(REF_CODE_KEY, urlRef);
      setRefCode(urlRef);
    } else {
      const stored = getSessionParameter(REF_CODE_KEY);
      setRefCode(stored);
    }
  }, []);

  const isAuthenticated = !!identity;

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-muted-foreground font-body text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <div className="min-h-screen flex flex-col">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1">
            <DashboardPage
              activeTab={activeTab}
              onTabChange={setActiveTab}
              pendingRefCode={refCode}
              onRefCodeConsumed={() => {
                sessionStorage.removeItem(REF_CODE_KEY);
                setRefCode(null);
              }}
            />
          </main>
          <Footer />
        </div>
      ) : (
        <LandingPage refCode={refCode} />
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast: "glass-card border-border font-body",
            title: "text-foreground",
            description: "text-muted-foreground",
          },
        }}
      />
    </>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;
  return (
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
  );
}
