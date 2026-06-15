import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";

type Entry = {
  version: string;
  date: string;
  tag?: "new" | "improved" | "fixed";
  title: string;
  items: string[];
};

const entries: Entry[] = [
  {
    version: "0.4.0",
    date: "June 15, 2026",
    tag: "new",
    title: "Changelog & polish",
    items: [
      "Added this changelog so you can follow every update.",
      "Header now links to /changelog from every page.",
    ],
  },
  {
    version: "0.3.0",
    date: "June 2026",
    tag: "new",
    title: "Community atlas",
    items: [
      "Public maps now appear on /explore for anyone to browse.",
      "Each saved map gets a shareable /map/<id> link.",
      "Email + Google sign-in via Lovable Cloud.",
    ],
  },
  {
    version: "0.2.0",
    date: "June 2026",
    tag: "new",
    title: "Map builder",
    items: [
      "Draw points, lines, and polygons anywhere in Michigan.",
      "Import and export GeoJSON and KML.",
      "Save maps to your account as public or private.",
    ],
  },
  {
    version: "0.1.0",
    date: "June 2026",
    tag: "new",
    title: "Launch",
    items: [
      "Great Lakes blue landing page.",
      "Premade Michigan atlas: lakes, cities, parks, lighthouses, breweries, U.P. spots.",
      "Interactive map viewer powered by MapLibre.",
    ],
  },
];

const tagStyles: Record<NonNullable<Entry["tag"]>, string> = {
  new: "bg-deep text-mist",
  improved: "bg-accent text-accent-foreground",
  fixed: "bg-muted text-foreground",
};

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — GISMI" },
      { name: "description", content: "Every update to GISMI — new maps, builder features, and improvements to the Michigan community atlas." },
      { property: "og:title", content: "GISMI Changelog" },
      { property: "og:description", content: "Track new releases and improvements to GISMI." },
    ],
  }),
  component: Changelog,
});

function Changelog() {
  return (
    <div className="min-h-screen topo-bg">
      <Header />
      <article className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Changelog</p>
        <h1 className="mt-2 font-display text-5xl font-bold">What's new in GISMI.</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Notable updates, in reverse chronological order.
        </p>

        <ol className="mt-12 space-y-12 border-l border-border pl-8">
          {entries.map((e) => (
            <li key={e.version} className="relative">
              <span className="absolute -left-[37px] top-2 grid h-4 w-4 place-items-center rounded-full border-2 border-background bg-deep" />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-display text-2xl font-bold">v{e.version}</h2>
                {e.tag && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tagStyles[e.tag]}`}>
                    {e.tag}
                  </span>
                )}
                <time className="text-sm text-muted-foreground">{e.date}</time>
              </div>
              <p className="mt-1 font-medium">{e.title}</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
                {e.items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </article>
    </div>
  );
}
