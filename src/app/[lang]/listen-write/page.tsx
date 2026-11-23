import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import ListenWrite from "@/components/ListenWrite";
import { getLanguage } from "@/data/languages";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = getLanguage((await params).lang);
  if (!lang) notFound();
  return (
    <div>
      <TopBar back={`/${lang.id}`} title={`Listen & Write · ${lang.name}`} color={lang.color} />
      <ListenWrite langId={lang.id} />
    </div>
  );
}
