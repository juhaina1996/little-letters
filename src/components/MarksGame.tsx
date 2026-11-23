"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "@/components/Script";
import VoiceNote from "@/components/VoiceNote";
import { MARKS, getLanguage, makeSyllable, markLetters, type LanguageId, type Syllable } from "@/data/languages";
import { markKey, pickWeighted, rightCount, shuffle, statOf, useProgress, useRecord } from "@/lib/progress";
import { speak, useHasVoice } from "@/lib/speech";
import { syllableSpeech } from "@/lib/syllableSpeech";

type Mode = "listen" | "read";
type Round = { answer: Syllable; options: Syllable[] };

const CHEERS = ["Great job! 🎉", "Super! 🌟", "Well done! 🥳", "You got it! 🏆", "Amazing! 🦄"];

/** Same letter, different signs: hear (or read) one and pick it. */
export default function MarksGame({ langId }: { langId: LanguageId }) {
  const lang = getLanguage(langId)!;
  const set = MARKS[langId]!;
  const progress = useProgress(lang.id);
  const record = useRecord(lang.id);
  const hasVoice = useHasVoice(lang.speechLang);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const lastMark = useRef<string | undefined>(undefined);

  const [mode, setMode] = useState<Mode>("listen");
  const [round, setRound] = useState<Round | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const [cheer, setCheer] = useState(CHEERS[0]);

  const stars = set.marks.reduce((n, m) => n + rightCount(statOf(progress, markKey(m.id))), 0);

  const say = useCallback((s: Syllable) => speak(syllableSpeech(langId, s), lang.speechLang), [langId, lang.speechLang]);

  const newRound = useCallback(() => {
    const consonants = markLetters(langId);
    const mark = pickWeighted(set.marks, (m) => markKey(m.id), progressRef.current, lastMark.current, 1);
    lastMark.current = markKey(mark.id);
    let answer: Syllable | null = null;
    while (!answer) answer = makeSyllable(langId, consonants[Math.floor(Math.random() * consonants.length)], mark);
    const others = shuffle(set.marks.filter((m) => m.id !== mark.id))
      .map((m) => makeSyllable(langId, answer!.letter, m))
      .filter((s): s is Syllable => !!s && s.roman !== answer!.roman)
      .slice(0, 3);
    setRound({ answer, options: shuffle([answer, ...others]) });
    setWrong([]);
    setWon(false);
  }, [langId, set.marks]);

  useEffect(() => {
    newRound();
  }, [newRound]);

  useEffect(() => {
    if (round && mode === "listen") say(round.answer);
  }, [round, mode, say]);

  if (!round) return null;

  const choose = (s: Syllable) => {
    if (won) return;
    if (s.text === round.answer.text) {
      if (wrong.length === 0) record(markKey(round.answer.mark.id), "quizRight");
      setWon(true);
      setCheer(CHEERS[Math.floor(Math.random() * CHEERS.length)]);
      say(s);
    } else {
      if (wrong.length === 0) record(markKey(round.answer.mark.id), "quizWrong");
      setWrong((w) => [...w, s.text]);
    }
  };

  return (
    <>
      <VoiceNote lang={lang} />
      <p className="mb-3 text-center text-2xl font-extrabold text-amber-500">⭐ {stars} stars</p>
      <div className="mb-5 flex gap-2 rounded-full bg-white p-1.5">
        {(["listen", "read"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="flex-1 rounded-full py-2 text-lg font-bold transition-colors"
            style={mode === m ? { background: lang.color, color: "white" } : { color: "#64748b" }}
          >
            {m === "listen" ? "👂 Listen" : "👀 Read"}
          </button>
        ))}
      </div>

      <div className="text-center">
        {mode === "listen" ? (
          <>
            <p className="text-lg text-slate-600">Listen — which one is it?</p>
            <button
              onClick={() => say(round.answer)}
              className="chunky mx-auto mt-3 grid h-32 w-32 place-items-center rounded-full text-6xl"
              style={{ background: lang.softColor }}
              aria-label="Play sound again"
            >
              🔊
            </button>
            <p className="mt-2 text-slate-400">{hasVoice === false || won ? `“${round.answer.roman}”` : " "}</p>
          </>
        ) : (
          <>
            <p className="text-lg text-slate-600">How do you say this?</p>
            <div className="mx-auto mt-3 inline-block rounded-[2rem] px-10 py-2" style={{ background: lang.softColor }}>
              <Script lang={lang} className="text-8xl font-bold leading-[1.5]">
                <span style={{ color: lang.color }}>{round.answer.text}</span>
              </Script>
            </div>
          </>
        )}

        <div dir={mode === "listen" ? lang.dir : "ltr"} className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-4">
          {round.options.map((s) => {
            const isWrong = wrong.includes(s.text);
            const isRight = won && s.text === round.answer.text;
            return (
              <button
                key={s.text}
                onClick={() => choose(s)}
                disabled={isWrong}
                className={`chunky aspect-[4/3] rounded-3xl font-bold ${isWrong ? "shake opacity-30" : ""} ${isRight ? "pop" : ""}`}
                style={{ background: isRight ? "#bbf7d0" : "white", color: lang.color }}
              >
                {mode === "listen" ? (
                  <Script lang={lang} className="text-6xl leading-[1.5]">
                    {s.text}
                  </Script>
                ) : (
                  <span className="text-4xl">{s.roman}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 h-16">
          {won ? (
            <button onClick={newRound} className="chunky pop rounded-full px-8 py-3 text-2xl font-extrabold text-white" style={{ background: lang.color }}>
              {cheer} Next ➡️
            </button>
          ) : wrong.length > 0 ? (
            <p className="text-xl text-slate-500">Oops! Try again 💪</p>
          ) : null}
        </div>
      </div>
    </>
  );
}
