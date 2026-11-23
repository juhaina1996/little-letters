"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Script from "@/components/Script";
import VoiceNote from "@/components/VoiceNote";
import { getLanguage, type LanguageId, type Letter } from "@/data/languages";
import { speak } from "@/lib/speech";
import { pickLetter, rightCount, shuffle, statOf, useProgress, useRecord } from "@/lib/progress";

type Mode = "picture" | "listen";
type Round = { answer: Letter; options: Letter[] };

const CHEERS = ["Great job! 🎉", "Super! 🌟", "Well done! 🥳", "You got it! 🏆", "Amazing! 🦄"];

export default function Game({ langId }: { langId: LanguageId }) {
  const lang = getLanguage(langId)!;
  const progress = useProgress(lang.id);
  const record = useRecord(lang.id);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const stars = lang.letters.reduce((n, l) => n + rightCount(statOf(progress, l.char)), 0);
  const [mode, setMode] = useState<Mode>("picture");
  const [round, setRound] = useState<Round | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [won, setWon] = useState(false);
  const [cheer, setCheer] = useState(CHEERS[0]);

  const pool = useMemo(
    () => (mode === "picture" ? lang.letters.filter((l) => l.word && l.starts !== false) : lang.letters),
    [lang, mode],
  );

  const newRound = useCallback(() => {
    const answer = pickLetter(pool, progressRef.current);
    // Distractors must look and sound different from the answer.
    const others = shuffle(
      lang.letters.filter((l) => l.char !== answer.char && l.roman !== answer.roman),
    ).slice(0, 3);
    setRound({ answer, options: shuffle([answer, ...others]) });
    setWrong([]);
    setWon(false);
  }, [pool, lang.letters]);

  useEffect(() => {
    newRound();
  }, [newRound]);

  const prompt = useCallback(() => {
    if (!round) return;
    const a = round.answer;
    speak(mode === "picture" ? a.word! : a.say ?? a.char, lang.speechLang);
  }, [round, mode, lang.speechLang]);

  useEffect(() => {
    if (mode === "listen") prompt();
  }, [prompt, mode]);

  const choose = (l: Letter) => {
    if (!round || won) return;
    if (l.char === round.answer.char) {
      setWon(true);
      setCheer(CHEERS[Math.floor(Math.random() * CHEERS.length)]);
      if (wrong.length === 0) record(l.char, "quizRight");
      speak(l.say ?? l.char, lang.speechLang);
    } else {
      if (wrong.length === 0) record(round.answer.char, "quizWrong");
      setWrong((w) => [...w, l.char]);
    }
  };

  return (
    <>
      <VoiceNote lang={lang} />
      <p className="mb-3 text-center text-2xl font-extrabold text-amber-500">⭐ {stars} stars</p>
      <div className="mb-5 flex gap-2 rounded-full bg-white p-1.5">
        {(["picture", "listen"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="flex-1 rounded-full py-2 text-lg font-bold transition-colors"
            style={mode === m ? { background: lang.color, color: "white" } : { color: "#64748b" }}
          >
            {m === "picture" ? "🖼️ Picture" : "👂 Listen"}
          </button>
        ))}
      </div>

      {round && (
        <div className="text-center">
          {mode === "picture" ? (
            <>
              <p className="text-lg text-slate-600">Which letter does this start with?</p>
              <button onClick={prompt} className="chunky mx-auto mt-3 block rounded-[2rem] bg-white px-10 py-4">
                <span className="block text-8xl">{round.answer.emoji}</span>
                <Script lang={lang} className="mt-2 block text-4xl font-bold">
                  {won ? round.answer.word : "?" + [...round.answer.word!].slice(round.answer.char.length).join("")}
                </Script>
                <span className="text-slate-500">
                  {round.answer.meaning} 🔊
                </span>
              </button>
            </>
          ) : (
            <>
              <p className="text-lg text-slate-600">Listen and find the letter!</p>
              <button
                onClick={prompt}
                className="chunky mx-auto mt-3 grid h-36 w-36 place-items-center rounded-full text-7xl"
                style={{ background: lang.softColor }}
                aria-label="Play sound again"
              >
                🔊
              </button>
              <p className="mt-2 text-slate-400">hint: “{round.answer.roman}”</p>
            </>
          )}

          <div dir={lang.dir} className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-4">
            {round.options.map((l) => {
              const isWrong = wrong.includes(l.char);
              const isRight = won && l.char === round.answer.char;
              return (
                <button
                  key={l.char}
                  onClick={() => choose(l)}
                  disabled={isWrong}
                  className={`chunky aspect-[4/3] rounded-3xl text-6xl font-bold ${isWrong ? "shake opacity-30" : ""} ${isRight ? "pop" : ""}`}
                  style={{ background: isRight ? "#bbf7d0" : "white", color: lang.color }}
                >
                  <Script lang={lang}>{l.char}</Script>
                </button>
              );
            })}
          </div>

          <div className="mt-6 h-16">
            {won ? (
              <button
                onClick={newRound}
                className="chunky pop rounded-full px-8 py-3 text-2xl font-extrabold text-white"
                style={{ background: lang.color }}
              >
                {cheer} Next ➡️
              </button>
            ) : wrong.length > 0 ? (
              <p className="text-xl text-slate-500">Oops! Try again 💪</p>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
