import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Event Portal
      </h1>
      <p className="max-w-md text-lg text-foreground/70">
        Your platform for discovering, registering, and managing events.
      </p>
      <div className="flex gap-4">
        <Link
          href="/events"
          className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
        >
          Browse Events
        </Link>
        <Link
          href="/admin"
          className="rounded-lg border border-foreground/20 px-5 py-2.5 text-sm font-medium transition hover:bg-foreground/5"
        >
          Admin
        </Link>
      </div>
    </main>
  );
}
