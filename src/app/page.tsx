import Link from "next/link";
import Terminal from "@/components/Terminal";

export default function Home() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4 sm:p-8 bg-[radial-gradient(ellipse_at_top,rgba(121,192,255,0.08),transparent_60%)]">
      <div className="flex h-[min(80dvh,760px)] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-panel shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        <div className="relative flex items-center gap-2 border-b border-border px-4 py-2.5 text-xs text-dim select-none">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <span className="absolute inset-x-0 text-center font-mono pointer-events-none">agustin@zago: ~</span>
          <Link href="/cv" className="ml-auto relative z-10 hover:text-foreground">view as page →</Link>
        </div>
        <Terminal />
      </div>
    </main>
  );
}
