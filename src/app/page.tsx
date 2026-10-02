import type { Viewport } from "next";
import Link from "next/link";
import Terminal from "@/components/Terminal";

// Android: shrink the page when the keyboard opens, so the prompt stays above it
export const viewport: Viewport = { width: "device-width", initialScale: 1, interactiveWidget: "resizes-content" };

export default function Home() {
  return (
    <main className="flex h-dvh sm:min-h-dvh sm:h-auto items-center justify-center sm:p-8 bg-[radial-gradient(ellipse_at_top,rgba(121,192,255,0.08),transparent_60%)]">
      <div className="flex h-full sm:h-[min(80dvh,760px)] w-full max-w-4xl flex-col overflow-hidden sm:rounded-xl sm:border border-border bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        <div className="relative flex items-center gap-2 border-b border-border px-4 py-2.5 text-xs text-dim select-none">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <span className="absolute inset-x-0 text-center font-mono pointer-events-none max-sm:hidden">agustin@zago: ~</span>
          <Link href="/cv" className="ml-auto relative z-10 hover:text-foreground">view api docs →</Link>
        </div>
        <Terminal />
      </div>
    </main>
  );
}
