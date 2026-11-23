import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Trace from "@/components/Trace";
import { getLanguage } from "@/data/languages";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = getLanguage((await params).lang);
  if (!lang) notFound();
  return (
    <div>
      <TopBar back={`/${lang.id}`} title={`Write · ${lang.name}`} color={lang.color} />
      <Trace langId={lang.id} />
    </div>
  );
}
