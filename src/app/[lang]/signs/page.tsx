import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import MarksBoard from "@/components/MarksBoard";
import { MARKS, getLanguage } from "@/data/languages";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = getLanguage((await params).lang);
  const set = lang && MARKS[lang.id];
  if (!lang || !set) notFound();
  return (
    <div>
      <TopBar back={`/${lang.id}`} title={`${set.title.split(" · ")[0]} · ${lang.name}`} color={lang.color} />
      <MarksBoard langId={lang.id} />
    </div>
  );
}
