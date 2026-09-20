import Link from "next/link";
import Terminal from "@/components/Terminal";

export default function Home() {
  return (
    <>
      <Link href="/cv" className="fixed right-3 top-2 z-10 rounded border border-border bg-panel px-2 py-1 text-xs text-dim hover:text-foreground font-mono">
        view as page →
      </Link>
      <Terminal />
    </>
  );
}
