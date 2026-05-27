import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Zap, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const CITIES = [
  "Balaka","Blantyre","Chikwawa","Chiradzulu","Chitipa","Dedza","Dowa",
  "Karonga","Kasungu","Likoma","Lilongwe","Machinga","Mangochi","Mchinji",
  "Mulanje","Mwanza","Mzimba","Neno","Nkhata Bay","Nkhotakota","Nsanje",
  "Ntcheu","Ntchisi","Phalombe","Rumphi","Salima","Thyolo","Zomba",
];

export default function RegisterPage() {
  const { register } = useAuth();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "Lilongwe",
    role: "customer" as "customer" | "worker" | "both",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(form);
      setLocation("/");
    } catch (e: any) {
      setError(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center mx-auto mb-3">
          <Zap size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-black">Create account</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Register to send emergency alerts
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl px-4 py-3 flex items-center gap-2 mb-4">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium mb-1 block">Full Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={set("name")}
            required
            className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-red-500/30"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            required
            className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-red-500/30"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Password *</label>
          <input
            type="password"
            value={form.password}
            onChange={set("password")}
            required
            className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-red-500/30"
            placeholder="At least 6 characters"
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-red-500/30"
            placeholder="0999 000 000"
          />
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">Your District</label>
          <select
            value={form.location}
            onChange={set("location")}
            className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none"
          >
            {CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium mb-1 block">I am a</label>
          <select
            value={form.role}
            onChange={set("role")}
            className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none"
          >
            <option value="customer">Customer (seeking help)</option>
            <option value="worker">Worker (providing help)</option>
            <option value="both">Both</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-red-600 font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
