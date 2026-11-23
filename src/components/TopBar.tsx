import Link from "next/link";

export default function TopBar({ back, title, color, right }: { back: string; title: string; color?: string; right?: React.ReactNode }) {
  return (
    <header className="mb-5 flex items-center gap-3">
      <Link
        href={back}
        aria-label="Go back"
        className="chunky grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-2xl"
      >
        ⬅️
      </Link>
      <h1 className="flex-1 truncate text-2xl font-extrabold sm:text-3xl" style={{ color }}>
        {title}
      </h1>
      {right}
    </header>
  );
}
