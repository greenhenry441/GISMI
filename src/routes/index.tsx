import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { PREMADE_MAPS } from "@/lib/premade-maps";
import { Compass, Layers, Share2, Download, MapPin, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GISMI — Michigan maps for everyone" },
      { name: "description", content: "Explore curated Michigan maps, build your own with GeoJSON & KML, and share them with the GISMI community." },
      { property: "og:title", content: "GISMI — Michigan maps for everyone" },
      { property: "og:description", content: "Explore, build, and share interactive maps of Michigan." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen topo-bg">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Made in Michigan · for Michigan
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Maps of the <span className="text-lake">Great Lakes State</span>, for everyone.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              GISMI is a community map service for Michigan. Browse hand-built collections of
              lighthouses, parks, breweries and cities — or draw your own and share it as
              GeoJSON or KML.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/explore"><Compass className="mr-2 h-4 w-4" />Explore the atlas</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/builder">Start building <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-4 text-center">
              <Stat n={`${PREMADE_MAPS.length}`} label="Premade maps" />
              <Stat n="83" label="Counties covered" />
              <Stat n="2" label="File formats" />
            </div>
          </div>

          {/* Hero map mockup */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-shore/30 via-lake/20 to-deep/30 blur-2xl" />
            <div className="overflow-hidden rounded-3xl border-2 border-border bg-card shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-border bg-mist px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-chart-5" />
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                <span className="ml-3 font-mono text-xs text-muted-foreground">gismi.app / great-lakes</span>
              </div>
              <div className="relative aspect-[5/4] bg-mist">
                <svg viewBox="0 0 500 400" className="absolute inset-0 h-full w-full">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M40 0 L0 0 0 40" fill="none" stroke="#4dabf7" strokeOpacity="0.15" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="500" height="400" fill="url(#grid)" />
                  {/* Stylized Michigan LP */}
                  <path d="M180 80 L220 70 L260 75 L295 95 L315 130 L330 175 L325 225 L310 270 L290 305 L260 325 L225 320 L195 295 L175 260 L165 220 L160 175 L165 130 Z" fill="#1e6091" fillOpacity="0.85" stroke="#0a2540" strokeWidth="2"/>
                  {/* Stylized UP */}
                  <path d="M70 100 L130 85 L185 90 L230 105 L260 125 L255 145 L210 150 L160 145 L110 150 L75 140 Z" fill="#1e6091" fillOpacity="0.85" stroke="#0a2540" strokeWidth="2"/>
                  {/* Markers */}
                  {[[245,150],[235,205],[225,170],[270,240],[200,280],[120,120],[210,115]].map(([x,y],i)=>(
                    <g key={i}>
                      <circle cx={x} cy={y} r="6" fill="#e85d3a" stroke="white" strokeWidth="2"/>
                    </g>
                  ))}
                  {/* Line route */}
                  <path d="M225 170 Q240 200 235 205 T270 240" fill="none" stroke="#e85d3a" strokeWidth="2.5" strokeDasharray="5 4"/>
                </svg>
                <div className="absolute bottom-3 right-3 rounded-md bg-card/95 px-3 py-1.5 text-xs font-medium shadow">
                  44.3148, -85.6024 · z7
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-card/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-3">
          <Feature icon={<Layers className="h-5 w-5" />} title="Curated collections" body="Premade maps of lighthouses, state parks, cities, lakes, breweries and more — ready to view and remix." />
          <Feature icon={<Compass className="h-5 w-5" />} title="Draw anything" body="Drop points, trace routes, and outline regions anywhere in Michigan with a fast, friendly editor." />
          <Feature icon={<Share2 className="h-5 w-5" />} title="GeoJSON + KML" body="Import existing data or export your maps as standard files. Publish to the community in one click." />
        </div>
      </section>

      {/* Premade gallery */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">From the GISMI atlas</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Start with a premade map</h2>
          </div>
          <Button asChild variant="ghost"><Link to="/explore">See all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PREMADE_MAPS.slice(0, 6).map((m) => (
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

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="overflow-hidden rounded-3xl bg-deep p-10 text-mist md:p-16">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">Build a map. Share it with Michigan.</h2>
              <p className="mt-3 text-mist/80">Create your first map in under a minute. Free, no install.</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button asChild size="lg" variant="secondary"><Link to="/builder">Open the builder</Link></Button>
              <Button asChild size="lg" variant="outline" className="border-mist/30 bg-transparent text-mist hover:bg-mist/10 hover:text-mist"><Link to="/explore">Browse community</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © GISMI · Maps of Michigan, made with 💙 by the community.
      </footer>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold text-lake">{n}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-lake">{icon}</div>
      <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
