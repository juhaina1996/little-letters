"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DrawPad from "@/components/DrawPad";
import Script from "@/components/Script";
import VoiceNote from "@/components/VoiceNote";
import { getLanguage, type LanguageId, type Letter } from "@/data/languages";
import { pickLetter, useProgress, useRecord } from "@/lib/progress";
import { speak, useHasVoice } from "@/lib/speech";

/** The app says a letter; she writes it from memory, then compares with the answer. */
export default function ListenWrite({ langId }: { langId: LanguageId }) {
  const lang = getLanguage(langId)!;
  const progress = useProgress(lang.id);
  const record = useRecord(lang.id);
  const hasVoice = useHasVoice(lang.speechLang);
  const [letter, setLetter] = useState<Letter | null>(null);
  const [checking, setChecking] = useState(false);
  const [hint, setHint] = useState(false);
  const [clears, setClears] = useState(0);
  const [round, setRound] = useState(0);

  const say = useCallback((l: Letter) => speak(l.say ?? l.char, lang.speechLang), [lang.speechLang]);

  const progressRef = useRef(progress);
  progressRef.current = progress;
  const letterRef = useRef<Letter | null>(null);

  const next = useCallback(() => {
    const l = pickLetter(lang.letters, progressRef.current, letterRef.current?.char);
    letterRef.current = l;
    setLetter(l);
    setChecking(false);
    setHint(false);
    setRound((r) => r + 1);
    setTimeout(() => say(l), 300);
  }, [lang.letters, say]);

  useEffect(() => {
    next();
  }, [next]);

  if (!letter) return null;

  const finish = (right: boolean) => {
    record(letter.char, right ? "wroteRight" : "wroteWrong");
    next();
  };

  return (
    <div className="mx-auto max-w-md">
      <VoiceNote lang={lang} />
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => say(letter)}
          className="chunky grid h-20 w-20 shrink-0 place-items-center rounded-full text-4xl"
          style={{ background: lang.softColor }}
          aria-label="Hear the letter again"
        >
          🔊
        </button>
        <div className="flex-1">
          <p className="text-xl font-bold">Listen and write the letter!</p>
          {hasVoice === false || hint ? (
            <p className="text-lg text-slate-600">
              It says “<b>{letter.roman}</b>”
              {letter.word && letter.starts !== false && (
                <>
                  {" "}
                  — like {letter.emoji} <Script lang={lang}>{letter.word}</Script>
                </>
              )}
            </p>
          ) : (
            <button onClick={() => setHint(true)} className="text-slate-500 underline">
              💡 Need a hint?
            </button>
          )}
        </div>
      </div>

      <DrawPad
        key={`${round}-${clears}`}
        borderColor={lang.color}
        overlay={
          checking ? (
            <div className="pop grid h-full place-items-center">
              <Script lang={lang} className="text-[min(62vw,17rem)] font-bold leading-none opacity-30">
                <span style={{ color: lang.color }}>{letter.char}</span>
              </Script>
            </div>
          ) : undefined
        }
      />

      {!checking ? (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <button onClick={() => setClears((c) => c + 1)} className="chunky rounded-2xl bg-white py-3 text-2xl" aria-label="Clear drawing">
            🧽
          </button>
          <button
            onClick={() => setChecking(true)}
            className="chunky col-span-2 rounded-2xl py-3 text-2xl font-extrabold text-white"
            style={{ background: lang.color }}
          >
            ✔️ Check
          </button>
        </div>
      ) : (
        <div className="pop mt-4 text-center">
          <p className="text-lg">
            The letter was{" "}
            <Script lang={lang} className="text-4xl font-bold">
              <span style={{ color: lang.color }}>{letter.char}</span>
            </Script>{" "}
            — does yours look the same?
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button onClick={() => finish(false)} className="chunky rounded-2xl bg-white py-3 text-xl font-bold">
              🔁 Not yet
            </button>
            <button onClick={() => finish(true)} className="chunky rounded-2xl bg-green-500 py-3 text-xl font-bold text-white">
              😊 Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
