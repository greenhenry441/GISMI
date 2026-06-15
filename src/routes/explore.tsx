import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { PREMADE_MAPS } from "@/lib/premade-maps";
import { listPublicMaps } from "@/lib/maps.functions";
import { MapPin, Users, Library, ArrowRight } from "lucide-react";

const communityQuery = queryOptions({
  queryKey: ["public-maps"],
  queryFn: () => listPublicMaps(),
});

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Michigan maps — GISMI" },
      { name: "description", content: "Browse curated Michigan map collections and community-built maps on GISMI." },
      { property: "og:title", content: "Explore Michigan maps — GISMI" },
      { property: "og:description", content: "Premade collections + maps from the GISMI community." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(communityQuery),
  component: Explore,
  errorComponent: () => <FallbackEmpty />,
  notFoundComponent: () => <FallbackEmpty />,
});

function Explore() {
  const { data: community } = useSuspenseQuery(communityQuery);

  return (
    <div className="min-h-screen topo-bg">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Explore</p>
          <h1 className="mt-2 font-display text-4xl font-bold">The GISMI atlas</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Curated Michigan map collections and the latest from the community.</p>
        </div>

        <section className="mb-14">
          <div className="mb-4 flex items-center gap-2">
            <Library className="h-5 w-5 text-lake" />
            <h2 className="font-display text-2xl font-semibold">Premade collections</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PREMADE_MAPS.map((m) => (
              <Link key={m.slug} to="/premade/$slug" params={{ slug: m.slug }} className="group rounded-2xl border border-border bg-card p-5 transition hover:border-accent hover:shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">{m.category}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{m.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{m.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-lake">
                  <MapPin className="h-3.5 w-3.5" />{m.geojson.features.length} features
                  <ArrowRight className="ml-auto h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-lake" />
            <h2 className="font-display text-2xl font-semibold">From the community</h2>
            <span className="text-sm text-muted-foreground">({community.length})</span>
          </div>
          {community.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
              <p className="text-muted-foreground">No community maps yet. <Link to="/builder" className="font-medium text-lake underline">Be the first to share one →</Link></p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {community.map((m) => (
                <Link key={m.id} to="/map/$id" params={{ id: m.id }} className="group rounded-2xl border border-border bg-card p-5 transition hover:border-accent hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-lake">{m.category ?? "Community"}</span>
                    <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold">{m.title}</h3>
                  {m.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{m.description}</p>}
                  <div className="mt-4 flex items-center text-xs font-medium text-lake">
                    View map <ArrowRight className="ml-auto h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FallbackEmpty() {
  return (
    <div className="min-h-screen topo-bg">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Couldn't load the atlas right now.</p>
      </div>
    </div>
  );
}
