import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-6">
      <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-6">
        You do not have permission to view this page.
      </p>
      <Link
        href="/"
        className="inline-block bg-primary text-white px-6 py-2 rounded-md text-sm font-medium transition hover:bg-primary/90"
      >
        Go Back Home
      </Link>
    </div>
  );
}
