import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import ProgressView from "@/components/ProgressView";
import { getLanguage } from "@/data/languages";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = getLanguage((await params).lang);
  if (!lang) notFound();
  return (
    <div>
      <TopBar back={`/${lang.id}`} title={`Progress · ${lang.name}`} color={lang.color} />
      <ProgressView langId={lang.id} />
    </div>
  );
}
