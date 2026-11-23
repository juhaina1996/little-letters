import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import SayLetter from "@/components/SayLetter";
import { getLanguage } from "@/data/languages";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = getLanguage((await params).lang);
  if (!lang) notFound();
  return (
    <div>
      <TopBar back={`/${lang.id}`} title={`Say it · ${lang.name}`} color={lang.color} />
      <SayLetter langId={lang.id} />
    </div>
  );
}
