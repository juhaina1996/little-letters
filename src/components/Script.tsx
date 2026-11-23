import type { Language } from "@/data/languages";

/** Renders text in the language's own script font and direction. */
export default function Script({ lang, children, className = "" }: { lang: Language; children: React.ReactNode; className?: string }) {
  return (
    <span dir={lang.dir} lang={lang.speechLang} className={className} style={{ fontFamily: lang.fontVar }}>
      {children}
    </span>
  );
}
