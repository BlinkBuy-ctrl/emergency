import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="text-6xl mb-4">🆘</div>
      <h1 className="text-2xl font-black mb-2">Page not found</h1>
      <p className="text-muted-foreground mb-6">This page doesn't exist.</p>
      <Link href="/" className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-all">
        Back to Emergency
      </Link>
    </div>
  );
}
