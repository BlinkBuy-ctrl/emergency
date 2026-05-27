import { supabase } from "./supabase";

const THEME_KEY = "blinkbuy_theme";
const LANG_KEY  = "blinkbuy_lang";

// ─── StoredUser interface — unchanged from original ───────────────────────────
export interface StoredUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  role: "customer" | "worker" | "both" | "admin";
  location?: string;
  profilePhoto?: string;
  bio?: string;
  isOnline?: boolean;
  isVerified?: boolean;
  isTrusted?: boolean;
  rating?: number;
  reviewCount?: number;
  jobsCompleted?: number;
}

export function isAdmin(user: any): boolean {
  if (!user) return false;
  return user.role === "admin" || user.email === "otechy8@gmail.com";
}

// ─── Google OAuth (same redirect behaviour as original) ───────────────────────
export async function signInWithGoogle(): Promise<void> {
  const redirectTo = `${window.location.origin}/`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: { prompt: "select_account" },
    },
  });
  if (error) throw new Error(error.message || "Google sign-in failed. Please try again.");
}

// ─── Theme ────────────────────────────────────────────────────────────────────
export function getTheme(): "light" | "dark" {
  return (localStorage.getItem(THEME_KEY) as "light" | "dark") || "light";
}

export function setTheme(theme: "light" | "dark") {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.classList.toggle("dark", theme === "dark");
}

// ─── Language ─────────────────────────────────────────────────────────────────
export function getLanguage(): "en" | "ny" {
  return (localStorage.getItem(LANG_KEY) as "en" | "ny") || "en";
}

export function setLanguage(lang: "en" | "ny") {
  localStorage.setItem(LANG_KEY, lang);
}

// ─── Currency formatter ───────────────────────────────────────────────────────
export function formatMK(amount: number | null | undefined): string {
  if (!amount) return "Negotiable";
  return `MK ${amount.toLocaleString()}`;
}
