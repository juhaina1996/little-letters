"use client";

import { useEffect, useState } from "react";

function findVoice(lang: string): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;
  const voices = window.speechSynthesis.getVoices();
  const norm = (l: string) => l.replace("_", "-").toLowerCase();
  const target = norm(lang);
  const prefix = target.split("-")[0];
  return voices.find((v) => norm(v.lang) === target) ?? voices.find((v) => norm(v.lang).startsWith(prefix));
}

/** Speak text with the browser's built-in voice. Silently does nothing if speech is unavailable. */
export function speak(text: string, lang: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  const voice = findVoice(lang);
  if (voice) u.voice = voice;
  u.rate = 0.75;
  synth.speak(u);
}

/** true / false once voices are known, null while still loading */
export function useHasVoice(lang: string): boolean | null {
  const [has, setHas] = useState<boolean | null>(null);
  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setHas(false);
      return;
    }
    const check = () => {
      if (window.speechSynthesis.getVoices().length > 0) setHas(!!findVoice(lang));
    };
    check();
    window.speechSynthesis.addEventListener("voiceschanged", check);
    const t = setTimeout(() => setHas((h) => (h === null ? !!findVoice(lang) : h)), 1500);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", check);
      clearTimeout(t);
    };
  }, [lang]);
  return has;
}
