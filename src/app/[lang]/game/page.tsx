import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Game from "@/components/Game";
import { getLanguage } from "@/data/languages";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = getLanguage((await params).lang);
  if (!lang) notFound();
  return (
    <div>
      <TopBar back={`/${lang.id}`} title={`Play · ${lang.name}`} color={lang.color} />
      <Game langId={lang.id} />
    </div>
  );
}
