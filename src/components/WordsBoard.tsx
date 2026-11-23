"use client";

import { useState } from "react";
import Script from "@/components/Script";
import VoiceNote from "@/components/VoiceNote";
import { getLanguage, type LanguageId } from "@/data/languages";
import { speak } from "@/lib/speech";

export default function WordsBoard({ langId }: { langId: LanguageId }) {
  const lang = getLanguage(langId)!;
  const words = lang.letters.filter((l) => l.word);
  const [flipped, setFlipped] = useState<string | null>(null);

  return (
    <>
      <VoiceNote lang={lang} />
      <p className="mb-4 text-center text-lg text-slate-600">Tap a picture to hear the word 👂</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {words.map((l) => {
          const active = flipped === l.char;
          return (
            <button
              key={l.char}
              onClick={() => {
                setFlipped(l.char);
                speak(l.word!, lang.speechLang);
              }}
              className="chunky flex flex-col items-center rounded-[2rem] border-4 bg-white px-2 py-4"
              style={{ borderColor: active ? lang.color : "transparent" }}
            >
              <span className={`text-6xl ${active ? "pop" : ""}`}>{l.emoji}</span>
              <Script lang={lang} className="mt-2 text-3xl font-bold leading-snug">
                {l.word}
              </Script>
              <span className="text-sm text-slate-500">{l.meaning}</span>
              <span className="mt-1 rounded-full px-3 text-sm font-bold" style={{ background: lang.softColor, color: lang.color }}>
                <Script lang={lang}>{l.char}</Script>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
