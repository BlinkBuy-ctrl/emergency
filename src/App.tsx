import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext, useAuthState, useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useScrollToTop } from "@/hooks/useScrollToTop";

// ── Lazy pages ─────────────────────────────────────────────────────────────
const EmergencyPage = lazy(() => import("@/pages/emergency"));
const LoginPage     = lazy(() => import("@/pages/login"));
const RegisterPage  = lazy(() => import("@/pages/register"));
const NotFound      = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 10 * 60_000,
      retry: 1,
      retryDelay: 2000,
      refetchOnWindowFocus: false,
      networkMode: "offlineFirst",
    },
    mutations: { retry: 0 },
  },
});

// Full-screen splash while Supabase restores the persisted session
function AuthLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center animate-pulse">
          <span className="text-white font-black text-lg">🆘</span>
        </div>
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
    </div>
  );
}

// Router — consumes auth from context (NOT from useAuthState directly)
function AppRoutes() {
  const { isLoading } = useAuth();
  useScrollToTop();

  if (isLoading) return <AuthLoader />;

  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/"          component={EmergencyPage} />
          <Route path="/emergency" component={EmergencyPage} />
          <Route path="/login"     component={LoginPage} />
          <Route path="/register"  component={RegisterPage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

// Root provider tree
function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthState();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
