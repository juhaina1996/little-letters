"use client";

import { useState } from "react";
import Script from "@/components/Script";
import { MARKS, getLanguage, type LanguageId } from "@/data/languages";
import { LEVELS, levelOf, markKey, resetProgress, rightCount, statOf, useProgress, wrongCount, type LetterStat } from "@/lib/progress";

function streak(days: string[]): number {
  const set = new Set(days);
  let n = 0;
  const d = new Date();
  if (!set.has(d.toLocaleDateString("en-CA"))) d.setDate(d.getDate() - 1); // today not played yet is fine
  while (set.has(d.toLocaleDateString("en-CA"))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

const ROWS: { key: keyof LetterStat; label: string }[] = [
  { key: "seen", label: "🔤 Looked at" },
  { key: "traced", label: "✏️ Traced" },
  { key: "quizRight", label: "⭐ Game right" },
  { key: "quizWrong", label: "Game missed" },
  { key: "wroteRight", label: "👂 Wrote right" },
  { key: "wroteWrong", label: "Wrote — not yet" },
  { key: "saidRight", label: "🎤 Said right" },
  { key: "saidWrong", label: "Said — not yet" },
];

export default function ProgressView({ langId }: { langId: LanguageId }) {
  const lang = getLanguage(langId)!;
  const progress = useProgress(lang.id);
  const [picked, setPicked] = useState<string | null>(null);

  const stats = lang.letters.map((l) => ({ l, s: statOf(progress, l.char) }));
  const levels = stats.map(({ s }) => levelOf(s));
  const count = (lvl: number) => levels.filter((x) => x === lvl).length;
  const markSet = MARKS[lang.id];
  const markStats = (markSet?.marks ?? []).map((m) => ({ m, s: statOf(progress, markKey(m.id)) }));
  const stars = stats.reduce((n, { s }) => n + rightCount(s), 0) + markStats.reduce((n, { s }) => n + rightCount(s), 0);
  const tricky = stats
    .filter(({ s }) => wrongCount(s) > 0 && levelOf(s) < 3)
    .sort((a, b) => wrongCount(b.s) - rightCount(b.s) - (wrongCount(a.s) - rightCount(a.s)))
    .slice(0, 6);
  const pickedStat = picked ? stats.find(({ l }) => l.char === picked) : null;

  const tiles = [
    { big: `${count(3)} / ${lang.letters.length}`, small: "letters mastered 🏆" },
    { big: `⭐ ${stars}`, small: "stars earned" },
    { big: `${progress.days.length}`, small: "days practised 📅" },
    { big: `🔥 ${streak(progress.days)}`, small: "day streak" },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.small} className="rounded-3xl bg-white p-4 text-center">
            <div className="text-3xl font-extrabold" style={{ color: lang.color }}>
              {t.big}
            </div>
            <div className="text-sm text-slate-500">{t.small}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 h-5 w-full overflow-hidden rounded-full bg-white">
        <div className="flex h-full">
          {[3, 2, 1].map((lvl) => (
            <div key={lvl} style={{ width: `${(count(lvl) / lang.letters.length) * 100}%`, background: LEVELS[lvl].fg }} />
          ))}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-3 text-sm">
        {LEVELS.map((lv, i) => (
          <span key={lv.label} className="rounded-full px-3 py-1" style={{ background: lv.bg, color: lv.fg }}>
            {lv.emoji} {lv.label}: {count(i)}
          </span>
        ))}
      </div>

      {tricky.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-xl font-bold text-slate-600">Practise these next 💪</h2>
          <div className="flex flex-wrap gap-2">
            {tricky.map(({ l }) => (
              <button key={l.char} onClick={() => setPicked(l.char)} className="chunky rounded-2xl bg-white px-4 py-2 text-3xl font-bold" style={{ color: lang.color }}>
                <Script lang={lang}>{l.char}</Script>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <h2 className="mb-2 text-xl font-bold text-slate-600">Every letter (tap one)</h2>
        <div dir={lang.dir} className="grid grid-cols-5 gap-2 sm:grid-cols-8">
          {stats.map(({ l }, i) => {
            const lv = LEVELS[levels[i]];
            return (
              <button
                key={l.char}
                onClick={() => setPicked(l.char)}
                className="relative aspect-square rounded-2xl border-4 text-3xl font-bold"
                style={{ background: lv.bg, color: lv.fg, borderColor: picked === l.char ? lang.color : "transparent" }}
              >
                <Script lang={lang}>{l.char}</Script>
                <span className="absolute -right-1 -top-2 text-base">{levels[i] > 0 ? lv.emoji : ""}</span>
              </button>
            );
          })}
        </div>
      </section>

      {markSet && (
        <section className="mt-6">
          <h2 className="mb-2 text-xl font-bold text-slate-600">{markSet.title}</h2>
          <div dir={lang.dir} className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {markStats.map(({ m, s }) => {
              const lvl = levelOf(s, 1);
              const lv = LEVELS[lvl];
              return (
                <div
                  key={m.id}
                  title={`${m.name}: ${s.quizRight} right, ${s.quizWrong} missed`}
                  className="relative flex aspect-square flex-col items-center justify-center rounded-2xl"
                  style={{ background: lv.bg, color: lv.fg }}
                >
                  <Script lang={lang} className="text-5xl font-bold leading-none">
                    {markSet.carrier + m.sign}
                  </Script>
                  <span className="text-[10px] font-bold" dir="ltr">
                    ✓{s.quizRight} ✗{s.quizWrong}
                  </span>
                  <span className="absolute -right-1 -top-2 text-base">{lvl > 0 ? lv.emoji : ""}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {pickedStat && (
        <div className="pop mt-4 rounded-3xl bg-white p-4">
          <div className="flex items-center gap-3">
            <Script lang={lang} className="text-5xl font-bold">
              <span style={{ color: lang.color }}>{pickedStat.l.char}</span>
            </Script>
            <div>
              <div className="text-xl font-bold">“{pickedStat.l.roman}”</div>
              <div className="text-slate-500">
                {LEVELS[levelOf(pickedStat.s)].emoji} {LEVELS[levelOf(pickedStat.s)].label}
                {pickedStat.s.lastPracticed && ` · last practised ${new Date(pickedStat.s.lastPracticed).toLocaleDateString()}`}
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {ROWS.map((r) => (
              <div key={r.key} className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">{r.label}</span>
                <b>{pickedStat.s[r.key] as number}</b>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-slate-400">
        Progress is saved on this device only.{" "}
        <button
          className="underline"
          onClick={() => {
            if (window.confirm(`Reset all ${lang.name} progress? This can't be undone.`)) resetProgress(lang.id);
          }}
        >
          Reset {lang.name} progress
        </button>
      </p>
    </div>
  );
}
