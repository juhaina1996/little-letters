"use client";

import { useEffect, useState } from "react";
import Script from "@/components/Script";
import VoiceNote from "@/components/VoiceNote";
import { getLanguage, type LanguageId, type LetterGroup } from "@/data/languages";
import { speak } from "@/lib/speech";
import { useRecord } from "@/lib/progress";

export default function LettersBoard({ langId }: { langId: LanguageId }) {
  const lang = getLanguage(langId)!;
  const letters = lang.letters;
  const [open, setOpen] = useState<number | null>(null);
  const groups: LetterGroup[] = ["vowel", "consonant"];

  const current = open === null ? null : letters[open];
  const record = useRecord(lang.id);

  useEffect(() => {
    if (!current) return;
    speak(current.say ?? current.char, lang.speechLang);
    record(current.char, "seen");
  }, [current, lang.speechLang, record]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : Math.min(letters.length - 1, i + 1)));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : Math.max(0, i - 1)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, letters.length]);

  return (
    <>
      <VoiceNote lang={lang} />
      {groups.map((g) => {
        const items = letters.map((l, i) => ({ l, i })).filter(({ l }) => l.group === g);
        if (items.length === 0) return null;
        return (
          <section key={g} className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-slate-600">{lang.groupLabels[g]}</h2>
            <div dir={lang.dir} className="grid grid-cols-4 gap-3 sm:grid-cols-6">
              {items.map(({ l, i }) => (
                <button
                  key={l.char}
                  onClick={() => setOpen(i)}
                  className="chunky flex aspect-square flex-col items-center justify-center rounded-3xl bg-white"
                >
                  <Script lang={lang} className="text-4xl font-bold leading-none sm:text-5xl">
                    <span style={{ color: lang.color }}>{l.char}</span>
                  </Script>
                  <span className="mt-1 text-xs text-slate-400" dir="ltr">
                    {l.roman}
                  </span>
                </button>
              ))}
            </div>
          </section>
        );
      })}

      {current && open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(null)}
        >
          <div
            key={current.char}
            className="pop relative w-full max-w-md rounded-[2.5rem] bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-xl"
            >
              ✖️
            </button>

            <button
              onClick={() => speak(current.say ?? current.char, lang.speechLang)}
              className="mx-auto block rounded-[2rem] px-10 py-2"
              style={{ background: lang.softColor }}
              aria-label="Say the letter"
            >
              <Script lang={lang} className="block text-[8rem] font-bold leading-[1.3]">
                <span style={{ color: lang.color }}>{current.char}</span>
              </Script>
            </button>
            <p className="mt-2 text-3xl font-extrabold">“{current.roman}” 🔊</p>

            {current.word ? (
              <button
                onClick={() => speak(current.word!, lang.speechLang)}
                className="chunky mt-5 flex w-full items-center gap-4 rounded-3xl bg-amber-50 p-4 text-left"
              >
                <span className="text-6xl">{current.emoji}</span>
                <span className="flex flex-col">
                  <Script lang={lang} className="text-4xl font-bold leading-snug">
                    {current.word}
                  </Script>
                  <span className="text-slate-500">
                    {current.wordRoman} · {current.meaning}
                  </span>
                </span>
              </button>
            ) : (
              <p className="mt-5 rounded-3xl bg-slate-50 p-4 text-slate-500">This letter is a quiet one — no picture word 🤫</p>
            )}

            <div className="mt-5 flex justify-between gap-3">
              <button
                disabled={open === 0}
                onClick={() => setOpen(open - 1)}
                className="chunky flex-1 rounded-2xl bg-slate-100 py-3 text-2xl disabled:opacity-30"
                aria-label="Previous letter"
              >
                ⬅️
              </button>
              <span className="self-center text-sm text-slate-400">
                {open + 1} / {letters.length}
              </span>
              <button
                disabled={open === letters.length - 1}
                onClick={() => setOpen(open + 1)}
                className="chunky flex-1 rounded-2xl py-3 text-2xl text-white disabled:opacity-30"
                style={{ background: lang.color }}
                aria-label="Next letter"
              >
                ➡️
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
