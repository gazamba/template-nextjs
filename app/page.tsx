import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-2xl space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          SaaS Starter
        </h1>
        <p className="text-lg text-muted-foreground">
          A production-ready Next.js template with auth, billing, analytics,
          error tracking, and more — pre-wired so you can focus on building your
          product.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/login">
            <Button>Get Started</Button>
          </Link>
          <a
            href="https://github.com/gazamba/template-nextjs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">GitHub</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
