import { notFound } from "next/navigation";
import { LANGUAGE_LIST, getLanguage } from "@/data/languages";

export function generateStaticParams() {
  return LANGUAGE_LIST.map((l) => ({ lang: l.id }));
}

export const dynamicParams = false;

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!getLanguage(lang)) notFound();
  return children;
}
