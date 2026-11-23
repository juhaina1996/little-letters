import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import WordsBoard from "@/components/WordsBoard";
import { getLanguage } from "@/data/languages";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = getLanguage((await params).lang);
  if (!lang) notFound();
  return (
    <div>
      <TopBar back={`/${lang.id}`} title={`${lang.name} Words`} color={lang.color} />
      <WordsBoard langId={lang.id} />
    </div>
  );
}
