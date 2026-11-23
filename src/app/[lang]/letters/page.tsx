import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import LettersBoard from "@/components/LettersBoard";
import { getLanguage } from "@/data/languages";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = getLanguage((await params).lang);
  if (!lang) notFound();
  return (
    <div>
      <TopBar back={`/${lang.id}`} title={`${lang.name} Letters`} color={lang.color} />
      <LettersBoard langId={lang.id} />
    </div>
  );
}
