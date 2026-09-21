"use client";

import { useEffect, useState } from "react";
import { SPINNER, THINKING_VERBS } from "@/lib/thinking";

const pick = () => THINKING_VERBS[Math.floor(Math.random() * THINKING_VERBS.length)];

export default function Thinking() {
  const [frame, setFrame] = useState(0);
  const [verb, setVerb] = useState(pick);

  useEffect(() => {
    const spin = setInterval(() => setFrame((f) => (f + 1) % SPINNER.length), 80);
    const words = setInterval(() => setVerb(pick), 1400);
    return () => {
      clearInterval(spin);
      clearInterval(words);
    };
  }, []);

  return (
    <div className="text-dim" aria-live="polite">
      <span className="text-prompt">{SPINNER[frame]}</span> {verb}…
    </div>
  );
}
