"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Letter } from "@/data/languages";

/** Everything we remember about one letter. */
export type LetterStat = {
  seen: number;
  traced: number;
  quizRight: number;
  quizWrong: number;
  wroteRight: number;
  wroteWrong: number;
  saidRight: number;
  saidWrong: number;
  lastPracticed?: number;
};

export type StatKey = Exclude<keyof LetterStat, "lastPracticed">;

type LangProgress = { letters: Record<string, LetterStat>; days: string[] };
type ProgressData = Record<string, LangProgress>;

const STORAGE_KEY = "little-letters:progress:v1";
const EMPTY: LangProgress = { letters: {}, days: [] };
const EMPTY_STAT: LetterStat = {
  seen: 0,
  traced: 0,
  quizRight: 0,
  quizWrong: 0,
  wroteRight: 0,
  wroteWrong: 0,
  saidRight: 0,
  saidWrong: 0,
};

let data: ProgressData | null = null;
const listeners = new Set<() => void>();

function load(): ProgressData {
  if (data) return data;
  try {
    data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as ProgressData;
  } catch {
    data = {};
  }
  return data;
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable — progress lives only for this visit */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      data = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

export function record(lang: string, char: string, key: StatKey) {
  const all = load();
  const prev = all[lang] ?? EMPTY;
  const stat = { ...EMPTY_STAT, ...prev.letters[char] };
  stat[key] += 1;
  stat.lastPracticed = Date.now();
  const d = today();
  all[lang] = {
    letters: { ...prev.letters, [char]: stat },
    days: prev.days.includes(d) ? prev.days : [...prev.days, d],
  };
  data = { ...all };
  save();
}

export function resetProgress(lang: string) {
  const all = load();
  delete all[lang];
  data = { ...all };
  save();
}

export function useProgress(lang: string): LangProgress {
  const snap = useSyncExternalStore(
    subscribe,
    () => load()[lang] ?? EMPTY,
    () => EMPTY,
  );
  return snap;
}

export function useRecord(lang: string) {
  return useCallback((char: string, key: StatKey) => record(lang, char, key), [lang]);
}

export const statOf = (p: LangProgress, char: string): LetterStat => ({ ...EMPTY_STAT, ...p.letters[char] });

export const rightCount = (s: LetterStat) => s.quizRight + s.wroteRight + s.saidRight;
export const wrongCount = (s: LetterStat) => s.quizWrong + s.wroteWrong + s.saidWrong;

/** 0 = new, 1 = started, 2 = learning, 3 = mastered */
export function levelOf(s: LetterStat): 0 | 1 | 2 | 3 {
  const right = rightCount(s);
  const activities = [s.quizRight, s.wroteRight, s.saidRight].filter((n) => n > 0).length;
  if (right >= 4 && activities >= 2 && right >= wrongCount(s) * 2) return 3;
  if (right >= 1) return 2;
  if (s.seen + s.traced + wrongCount(s) > 0) return 1;
  return 0;
}

export const LEVELS = [
  { label: "New", emoji: "🥚", bg: "#f1f5f9", fg: "#94a3b8" },
  { label: "Started", emoji: "🐣", bg: "#fef3c7", fg: "#b45309" },
  { label: "Learning", emoji: "🐥", bg: "#dbeafe", fg: "#1d4ed8" },
  { label: "Mastered", emoji: "🏆", bg: "#bbf7d0", fg: "#15803d" },
] as const;

/** Pick a letter, favouring ones she finds hard or hasn't practised. */
export function pickLetter(letters: Letter[], p: LangProgress, avoid?: string): Letter {
  const pool = letters.length > 1 && avoid ? letters.filter((l) => l.char !== avoid) : letters;
  const weights = pool.map((l) => {
    const s = statOf(p, l.char);
    const lvl = levelOf(s);
    return [4, 3, 2, 0.6][lvl] + Math.min(wrongCount(s), 5) * 0.5;
  });
  let r = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
