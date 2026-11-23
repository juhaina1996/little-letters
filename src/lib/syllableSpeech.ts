import type { LanguageId, Syllable } from "@/data/languages";

/** What the voice should say for a syllable. A lone sukun is read with a leading "a" (أَبْ = "ab"). */
export function syllableSpeech(langId: LanguageId, s: Syllable): string {
  if (langId === "arabic" && s.mark.id === "sukun") return "أَ" + s.text;
  return s.text;
}
