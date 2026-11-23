"use client";

import { useHasVoice } from "@/lib/speech";
import type { Language } from "@/data/languages";

/** Tells the grown-up when this device has no voice for the language. */
export default function VoiceNote({ lang }: { lang: Language }) {
  const has = useHasVoice(lang.speechLang);
  if (has !== false) return null;
  return (
    <p className="mb-4 rounded-2xl bg-white/80 px-4 py-2 text-sm text-slate-600">
      🔇 This device has no {lang.name} voice, so the speaker buttons may be quiet. Grown-ups: add a {lang.name} voice in
      your device&apos;s speech / text-to-speech settings (Chrome on Android usually has one).
    </p>
  );
}
