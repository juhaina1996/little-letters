"use client";

import { useState } from "react";
import DrawPad from "@/components/DrawPad";
import Script from "@/components/Script";
import { getLanguage, type LanguageId } from "@/data/languages";
import { useRecord } from "@/lib/progress";
import { speak } from "@/lib/speech";

export default function Trace({ langId }: { langId: LanguageId }) {
  const lang = getLanguage(langId)!;
  const record = useRecord(lang.id);
  const [index, setIndex] = useState(0);
  const [clears, setClears] = useState(0);
  const letter = lang.letters[index];

  const go = (d: number) => setIndex((i) => (i + d + lang.letters.length) % lang.letters.length);

  return (
    <div className="mx-auto max-w-md">
      <DrawPad
        key={`${index}-${clears}`}
        borderColor={lang.color}
        onFirstStroke={() => record(letter.char, "traced")}
        guide={
          <Script lang={lang} className="text-[min(62vw,17rem)] font-bold leading-none text-slate-200">
            {letter.char}
          </Script>
        }
      />
      <div className="mt-4 grid grid-cols-4 gap-3">
        <button onClick={() => go(-1)} className="chunky rounded-2xl bg-white py-3 text-2xl" aria-label="Previous letter">
          ⬅️
        </button>
        <button onClick={() => speak(letter.say ?? letter.char, lang.speechLang)} className="chunky rounded-2xl bg-white py-3 text-2xl" aria-label="Say the letter">
          🔊
        </button>
        <button onClick={() => setClears((c) => c + 1)} className="chunky rounded-2xl bg-white py-3 text-2xl" aria-label="Clear drawing">
          🧽
        </button>
        <button onClick={() => go(1)} className="chunky rounded-2xl py-3 text-2xl text-white" style={{ background: lang.color }} aria-label="Next letter">
          ➡️
        </button>
      </div>
      <p className="mt-3 text-center text-lg text-slate-500">
        “{letter.roman}” · {index + 1} / {lang.letters.length}
      </p>
    </div>
  );
}
