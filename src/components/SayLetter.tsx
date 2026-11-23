"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "@/components/Script";
import { getLanguage, type LanguageId, type Letter } from "@/data/languages";
import { pickLetter, useProgress, useRecord } from "@/lib/progress";
import { getRecognizer, matchesLetter, type Recognizer } from "@/lib/recognition";
import { speak } from "@/lib/speech";

type Status = "idle" | "listening" | "right" | "wrong";

/** Shows a letter; she says it (or a word starting with it) into the microphone. */
export default function SayLetter({ langId }: { langId: LanguageId }) {
  const lang = getLanguage(langId)!;
  const progress = useProgress(lang.id);
  const record = useRecord(lang.id);
  const [letter, setLetter] = useState<Letter | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [heard, setHeard] = useState("");
  const [error, setError] = useState("");
  const [supported, setSupported] = useState(true);
  const recRef = useRef<Recognizer | null>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const letterRef = useRef<Letter | null>(null);
  const missedRef = useRef(false);

  const next = useCallback(() => {
    recRef.current?.abort();
    const l = pickLetter(lang.letters, progressRef.current, letterRef.current?.char);
    letterRef.current = l;
    missedRef.current = false;
    setLetter(l);
    setStatus("idle");
    setHeard("");
    setError("");
  }, [lang.letters]);

  useEffect(() => {
    setSupported(!!getRecognizer());
    next();
    return () => recRef.current?.abort();
  }, [next]);

  const markRight = () => {
    if (!letterRef.current) return;
    record(letterRef.current.char, "saidRight");
    setStatus("right");
    speak(letterRef.current.say ?? letterRef.current.char, lang.speechLang);
  };

  const markWrong = () => {
    if (!letterRef.current) return;
    if (!missedRef.current) record(letterRef.current.char, "saidWrong"); // count one miss per letter
    missedRef.current = true;
    setStatus("wrong");
  };

  const listen = () => {
    const Ctor = getRecognizer();
    if (!Ctor || !letterRef.current) return;
    recRef.current?.abort();
    const rec = new Ctor();
    rec.lang = lang.speechLang;
    rec.interimResults = true;
    rec.maxAlternatives = 5;
    rec.continuous = false;
    let done = false;

    rec.onresult = (e) => {
      const alts: string[] = [];
      let final = false;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        for (let j = 0; j < r.length; j++) alts.push(r[j].transcript);
        if (r.isFinal) final = true;
      }
      setHeard(alts[0] ?? "");
      if (done || !letterRef.current) return;
      if (matchesLetter(alts, letterRef.current)) {
        done = true;
        rec.stop();
        markRight();
      } else if (final) {
        done = true;
        markWrong();
      }
    };
    rec.onerror = (e) => {
      done = true;
      setStatus("idle");
      setError(
        e.error === "not-allowed" || e.error === "service-not-allowed"
          ? "The microphone is blocked. Grown-ups: allow the microphone for this page."
          : e.error === "no-speech"
            ? "I didn't hear anything — tap the mic and speak a bit louder! 🙂"
            : e.error === "language-not-supported"
              ? `This browser can't listen in ${lang.name}. Try Chrome, or use the grown-up buttons below.`
              : "Hmm, something went wrong. Try again!",
      );
    };
    rec.onend = () => {
      if (!done) setStatus((s) => (s === "listening" ? "idle" : s));
    };

    setError("");
    setHeard("");
    setStatus("listening");
    recRef.current = rec;
    rec.start();
  };

  if (!letter) return null;

  return (
    <div className="mx-auto max-w-md text-center">
      <p className="text-xl font-bold">Say this letter — or a word that starts with it!</p>

      <div
        className={`mx-auto mt-4 rounded-[2.5rem] px-6 py-4 ${status === "right" ? "pop" : ""} ${status === "wrong" ? "shake" : ""}`}
        style={{ background: status === "right" ? "#bbf7d0" : lang.softColor }}
      >
        <Script lang={lang} className="block text-[9rem] font-bold leading-[1.3]">
          <span style={{ color: lang.color }}>{letter.char}</span>
        </Script>
      </div>

      {supported ? (
        <button
          onClick={listen}
          disabled={status === "listening" || status === "right"}
          className={`chunky mx-auto mt-6 grid h-28 w-28 place-items-center rounded-full text-5xl text-white disabled:opacity-60 ${status === "listening" ? "animate-pulse" : ""}`}
          style={{ background: status === "listening" ? "#ef4444" : lang.color }}
          aria-label="Tap and speak"
        >
          🎤
        </button>
      ) : (
        <p className="mt-6 rounded-2xl bg-white/80 p-3 text-slate-600">
          This browser can&apos;t listen. Grown-ups: ask her to say the letter, then tap a button below. (Chrome works best.)
        </p>
      )}

      <div className="mt-4 min-h-24 text-lg">
        {status === "listening" && <p className="text-slate-500">I&apos;m listening… 👂 {heard && <Script lang={lang}>“{heard}”</Script>}</p>}
        {status === "right" && (
          <div className="pop">
            <p className="text-2xl font-extrabold text-green-600">Yes! That&apos;s “{letter.roman}” 🎉</p>
            <button onClick={next} className="chunky mt-3 rounded-full px-8 py-3 text-2xl font-extrabold text-white" style={{ background: lang.color }}>
              Next ➡️
            </button>
          </div>
        )}
        {status === "wrong" && (
          <div>
            {heard && (
              <p className="text-slate-500">
                I heard <Script lang={lang}>“{heard}”</Script>
              </p>
            )}
            <p className="font-bold">Almost! Listen and try again 💪</p>
            <button onClick={() => speak(letter.say ?? letter.char, lang.speechLang)} className="chunky mt-2 rounded-full bg-white px-6 py-2 text-xl">
              🔊 Hear it
            </button>
          </div>
        )}
        {error && <p className="text-slate-600">{error}</p>}
      </div>

      {status !== "right" && (
        <div className="mt-4 rounded-2xl bg-white/70 p-3 text-sm text-slate-500">
          Grown-up check:
          <div className="mt-2 flex justify-center gap-2">
            <button onClick={markRight} className="rounded-full bg-green-100 px-4 py-2 font-bold text-green-700">
              ✅ She said it right
            </button>
            <button onClick={() => { markWrong(); next(); }} className="rounded-full bg-slate-100 px-4 py-2 font-bold">
              🔁 Not yet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
