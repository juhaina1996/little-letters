"use client";

// Minimal typings — the Web Speech recognition API is not in TypeScript's DOM lib.
type RecognitionAlternative = { transcript: string; confidence: number };
type RecognitionResult = { isFinal: boolean; length: number; [i: number]: RecognitionAlternative };
export type RecognitionEvent = { resultIndex: number; results: { length: number; [i: number]: RecognitionResult } };
export type RecognitionErrorEvent = { error: string };

export interface Recognizer {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((e: RecognitionEvent) => void) | null;
  onerror: ((e: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type RecognizerCtor = new () => Recognizer;

export function getRecognizer(): RecognizerCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognizerCtor; webkitSpeechRecognition?: RecognizerCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Lower-case, strip Arabic vowel marks and unify alif forms so matching is forgiving. */
export function normalize(s: string): string {
  return s
    .normalize("NFC")
    .replace(/[ً-ْٰـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[.,!?؟،।]/g, " ")
    .toLowerCase()
    .trim();
}

/** Did the child say the letter, its name, or a word starting with it? */
export function matchesLetter(heard: string[], letter: { char: string; roman: string; say?: string; word?: string }): boolean {
  const char = normalize(letter.char);
  const name = letter.say ? normalize(letter.say) : null;
  const roman = letter.roman.toLowerCase();
  const word = letter.word ? normalize(letter.word) : null;
  return heard.some((h) => {
    const text = normalize(h);
    if (word && text.includes(word)) return true;
    if (name && text.includes(name)) return true;
    return text.split(/\s+/).some((w) => {
      const bare = char !== "ا" ? w.replace(/^ال/, "") : w; // Arabic "al-" prefix
      return w.startsWith(char) || bare.startsWith(char) || w === roman || w === roman.replace(/a$/, "");
    });
  });
}
