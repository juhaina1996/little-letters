"use client";

import { useEffect, useState } from "react";
import Script from "@/components/Script";
import VoiceNote from "@/components/VoiceNote";
import { MARKS, getLanguage, makeSyllable, markLetters, type LanguageId, type Syllable } from "@/data/languages";
import { markKey, useRecord } from "@/lib/progress";
import { speak } from "@/lib/speech";
import { syllableSpeech } from "@/lib/syllableSpeech";

type View = "sign" | "letter";

export default function MarksBoard({ langId }: { langId: LanguageId }) {
  const lang = getLanguage(langId)!;
  const set = MARKS[langId]!;
  const consonants = markLetters(langId);
  const record = useRecord(lang.id);
  const [view, setView] = useState<View>("sign");
  const [markIdx, setMarkIdx] = useState(0);
  const [letterIdx, setLetterIdx] = useState(1 < consonants.length ? 1 : 0);
  const [last, setLast] = useState<string | null>(null);

  const mark = set.marks[markIdx];
  const letter = consonants[letterIdx];

  useEffect(() => {
    if (view === "sign") record(markKey(mark.id), "seen");
  }, [view, mark.id, record]);

  const play = (s: Syllable) => {
    setLast(s.text);
    speak(syllableSpeech(langId, s), lang.speechLang);
  };

  const syllables =
    view === "sign"
      ? consonants.map((l) => makeSyllable(langId, l, mark)).filter((s): s is Syllable => !!s)
      : set.marks.map((m) => makeSyllable(langId, letter, m)).filter((s): s is Syllable => !!s);

  return (
    <>
      <VoiceNote lang={lang} />
      <div className="mb-5 flex gap-2 rounded-full bg-white p-1.5">
        {(["sign", "letter"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="flex-1 rounded-full py-2 text-lg font-bold transition-colors"
            style={view === v ? { background: lang.color, color: "white" } : { color: "#64748b" }}
          >
            {v === "sign" ? "One sign, all letters" : "One letter, all signs"}
          </button>
        ))}
      </div>

      {view === "sign" ? (
        <>
          <div dir={lang.dir} className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:flex-wrap sm:justify-center">
            {set.marks.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setMarkIdx(i)}
                className="chunky h-20 min-w-20 shrink-0 overflow-hidden rounded-2xl px-2 text-6xl font-bold leading-none"
                style={i === markIdx ? { background: lang.color, color: "white" } : { background: "white", color: lang.color }}
                aria-label={m.name}
              >
                <Script lang={lang}>{set.carrier + m.sign}</Script>
              </button>
            ))}
          </div>
          <div key={mark.id} className="pop mb-5 flex items-center gap-4 rounded-[2rem] px-5 py-4" style={{ background: lang.softColor }}>
            <Script lang={lang} className="text-[7rem] font-bold leading-[1.2]">
              <span style={{ color: lang.color }}>{set.carrier + mark.sign}</span>
            </Script>
            <div>
              <div className="text-2xl font-extrabold">{mark.name}</div>
              {mark.nativeName && (
                <Script lang={lang} className="text-xl">
                  {mark.nativeName}
                </Script>
              )}
              <div className="text-slate-600">
                {mark.id === "sukun"
                  ? "No vowel — the letter stops (أَبْ = “ab”)"
                  : mark.id === "shadda"
                    ? "Say the letter twice (بَّ = “bba”)"
                    : mark.id === "chandrakkala"
                      ? "Takes away the “a” — a short, soft ending"
                      : `Adds the sound “${mark.sound}”`}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div dir={lang.dir} className="mb-5 flex flex-wrap justify-center gap-2">
          {consonants.map((l, i) => (
            <button
              key={l.char}
              onClick={() => setLetterIdx(i)}
              className="h-12 min-w-12 rounded-xl px-2 text-2xl font-bold"
              style={i === letterIdx ? { background: lang.color, color: "white" } : { background: "white", color: lang.color }}
            >
              <Script lang={lang}>{l.char}</Script>
            </button>
          ))}
        </div>
      )}

      <p className="mb-3 text-center text-slate-500">Tap to hear 👂</p>
      <div dir={lang.dir} className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {syllables.map((s) => (
          <button
            key={s.text}
            onClick={() => play(s)}
            className={`chunky flex aspect-square flex-col items-center justify-center rounded-3xl ${last === s.text ? "pop" : ""}`}
            style={{ background: last === s.text ? lang.softColor : "white" }}
          >
            <Script lang={lang} className="text-5xl font-bold leading-[1.5]">
              <span style={{ color: lang.color }}>{s.text}</span>
            </Script>
            <span className="text-sm text-slate-500" dir="ltr">
              {s.roman}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
