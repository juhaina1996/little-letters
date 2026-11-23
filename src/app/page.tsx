import Link from "next/link";
import Script from "@/components/Script";
import { LANGUAGE_LIST } from "@/data/languages";

export default function Home() {
  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <div className="float text-7xl">🦉</div>
      <h1 className="mt-2 text-5xl font-extrabold tracking-tight text-[#3b2f4a]">Little Letters</h1>
      <p className="mt-1 text-xl text-slate-600">Which language shall we play today?</p>

      <div className="mt-8 grid w-full gap-5 sm:grid-cols-3">
        {LANGUAGE_LIST.map((lang) => (
          <Link
            key={lang.id}
            href={`/${lang.id}`}
            className="chunky flex flex-col items-center rounded-[2rem] border-4 bg-white px-4 py-6"
            style={{ borderColor: lang.color }}
          >
            <span className="text-5xl">{lang.emoji}</span>
            <Script lang={lang} className="mt-3 text-5xl font-bold leading-tight">
              <span style={{ color: lang.color }}>{lang.nativeName}</span>
            </Script>
            <span className="mt-1 text-2xl font-bold">{lang.name}</span>
            <Script lang={lang} className="mt-1 text-lg text-slate-500">
              {lang.hello}!
            </Script>
          </Link>
        ))}
      </div>
    </div>
  );
}
