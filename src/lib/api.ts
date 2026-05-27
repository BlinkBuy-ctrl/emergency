/**
 * Emergency API client
 * Mirrors the relevant emergency routes from the original BlinkBuy api.ts.
 * Backend contracts are UNCHANGED — only the subset needed by the Emergency
 * module is included here.
 */
import { supabase } from "./supabase";

// ─── Timeout wrapper ──────────────────────────────────────────────────────────
function withTimeout<T>(promise: Promise<T>, ms = 7000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error("Request timed out. Please check your connection and try again.")),
        ms
      )
    ),
  ]);
}

// ─── Auth helper ──────────────────────────────────────────────────────────────
async function getAuthUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Not authenticated");
  return session.user;
}

// ─── Normalizer ───────────────────────────────────────────────────────────────
function normalizeWorker(p: any) {
  if (!p) return null;
  return {
    ...p,
    profilePhoto: p.profilePhoto ?? p.profile_photo ?? null,
    isOnline: p.isOnline ?? p.is_online ?? false,
    isVerified: p.isVerified ?? p.is_verified ?? false,
    isTrusted: p.isTrusted ?? p.is_trusted ?? false,
    isBoosted: p.isBoosted ?? p.is_boosted ?? false,
  };
}

// ─── Emergency workers — GET /emergency/workers ───────────────────────────────
async function getEmergencyWorkers(options?: {
  isOnline?: boolean;
  location?: string;
  category?: string;
}): Promise<{ workers: any[] }> {
  let q = supabase.from("profiles").select("*").in("role", ["worker", "both"]);
  if (options?.isOnline != null) q = q.eq("is_online", options.isOnline);
  if (options?.location) q = q.ilike("location", `%${options.location}%`);
  if (options?.category) q = q.eq("category", options.category);
  const { data, error } = await q;
  if (error && error.code !== "PGRST116") throw new Error(error.message ?? JSON.stringify(error));
  return { workers: (data ?? []).map(normalizeWorker) };
}

// ─── Send alert — POST /emergency/alert ───────────────────────────────────────
async function sendEmergencyAlert(body: {
  type: string;
  location: string;
  description?: string;
  user_id: string;
}): Promise<any> {
  const user = await getAuthUser();
  const controller = new AbortController();
  const { data, error } = await supabase
    .from("emergency_requests")
    .insert({ ...body, user_id: user.id })
    .select()
    .single()
    .abortSignal(controller.signal);
  if (error) throw new Error(error.message ?? JSON.stringify(error));
  return data;
}

// ─── Public API ───────────────────────────────────────────────────────────────
export const emergencyApi = {
  getWorkers: (opts?: Parameters<typeof getEmergencyWorkers>[0]) =>
    withTimeout(getEmergencyWorkers(opts), 7000),
  sendAlert: (body: Parameters<typeof sendEmergencyAlert>[0]) =>
    withTimeout(sendEmergencyAlert(body), 7000),
};
