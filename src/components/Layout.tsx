import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { usePWA } from "@/hooks/usePWA";
import {
  Zap, Sun, Moon, LogOut, User, Menu, X, Download, Settings,
} from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile, isLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isInstallable, install } = usePWA();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = profile?.name ?? user?.email?.split("@")[0] ?? "User";

  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 bg-red-700 dark:bg-red-800 shadow-md">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white font-black text-lg">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span>BB Emergency</span>
          </Link>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* PWA install */}
            {isInstallable && (
              <button
                onClick={install}
                className="hidden sm:flex items-center gap-1.5 text-xs text-white/80 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-all"
              >
                <Download size={13} /> Install
              </button>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Auth state */}
            {!isLoading && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(o => !o)}
                    className="flex items-center gap-1.5 text-white/80 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-all text-xs font-medium"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block max-w-[80px] truncate">{displayName}</span>
                    {menuOpen ? <X size={12} /> : <Menu size={12} />}
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-1 w-40 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50">
                      <button
                        onClick={() => { setMenuOpen(false); logout(); }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted text-destructive transition-colors"
                      >
                        <LogOut size={13} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/login"
                    className="text-xs text-white/80 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-all font-medium"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="text-xs bg-white text-red-700 px-2.5 py-1.5 rounded-lg font-bold hover:bg-white/90 transition-all"
                  >
                    Register
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="py-6 px-4 text-center text-xs text-muted-foreground border-t border-border">
        <p>BlinkBuy Emergency — 24/7 Immediate Help Across Malawi</p>
        <p className="mt-1">
          Life-threatening emergencies? Call national emergency services:{" "}
          <a href="tel:998" className="text-red-600 font-bold hover:underline">998</a>
        </p>
      </footer>
    </div>
  );
}
