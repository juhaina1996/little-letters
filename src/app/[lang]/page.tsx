import Link from "next/link";
import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Script from "@/components/Script";
import { MARKS, getLanguage } from "@/data/languages";

const ACTIVITIES = [
  { slug: "letters", emoji: "🔤", title: "Letters", hint: "Tap a letter and listen" },
  { slug: "words", emoji: "🧸", title: "Words", hint: "Pictures and easy words" },
  { slug: "game", emoji: "⭐", title: "Play", hint: "Find the right letter" },
  { slug: "trace", emoji: "✏️", title: "Trace", hint: "Trace with your finger" },
  { slug: "listen-write", emoji: "👂", title: "Listen & Write", hint: "Hear a letter, write it" },
  { slug: "say", emoji: "🎤", title: "Say it", hint: "Read the letter out loud" },
];

export default async function LanguageHome({ params }: { params: Promise<{ lang: string }> }) {
  const lang = getLanguage((await params).lang);
  if (!lang) notFound();
  const marks = MARKS[lang.id];
  const activities = marks
    ? [
        ...ACTIVITIES,
        { slug: "signs", emoji: marks.carrier + marks.marks[0].sign + marks.marks[1].sign, title: marks.title.split(" · ")[0], hint: "Learn the vowel signs", script: true },
        { slug: "signs-game", emoji: "🎯", title: "Signs game", hint: "Hear it, find it" },
      ]
    : ACTIVITIES;
  const sample = lang.letters.slice(0, 3).map((l) => l.char).join(" ");

  return (
    <div>
      <TopBar back="/" title={lang.name} color={lang.color} />
      <div className="mb-6 rounded-[2rem] px-6 py-6 text-center" style={{ background: lang.softColor }}>
        <Script lang={lang} className="block text-7xl font-bold" >
          <span style={{ color: lang.color }}>{sample}</span>
        </Script>
        <p className="mt-2 text-lg text-slate-600">What do you want to do?</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {activities.map((a) => (
          <Link
            key={a.slug}
            href={`/${lang.id}/${a.slug}`}
            className="chunky flex flex-col items-center rounded-[2rem] bg-white px-3 py-6 text-center"
          >
            {"script" in a ? (
              <Script lang={lang} className="h-12 text-5xl font-bold leading-none">
                <span style={{ color: lang.color }}>{a.emoji}</span>
              </Script>
            ) : (
              <span className="text-5xl">{a.emoji}</span>
            )}
            <span className="mt-2 text-2xl font-extrabold" style={{ color: lang.color }}>
              {a.title}
            </span>
            <span className="text-sm text-slate-500">{a.hint}</span>
          </Link>
        ))}
      </div>
      <Link
        href={`/${lang.id}/progress`}
        className="chunky mt-4 flex items-center justify-center gap-3 rounded-[2rem] px-4 py-5 text-2xl font-extrabold text-white"
        style={{ background: lang.color }}
      >
        📈 My Progress
      </Link>
    </div>
  );
}
