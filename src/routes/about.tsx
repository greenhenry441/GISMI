import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — GISMI" },
      { name: "description", content: "GISMI is a small Michigan-based mapping service for exploring, building, and sharing maps of the Great Lakes State." },
      { property: "og:title", content: "About GISMI" },
      { property: "og:description", content: "A small Michigan mapping business and community atlas." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen topo-bg">
      <Header />
      <article className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">About</p>
        <h1 className="mt-2 font-display text-5xl font-bold">GISMI — geographic information for Michigan.</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          GISMI is a small business and a community mapping service. We make Michigan maps —
          and we hand the tools to you, too.
        </p>
        <div className="mt-10 space-y-6 text-base leading-relaxed">
          <p>
            Every county, lake, trail, and roadside diner has a place on the map. GISMI puts that
            map at your fingertips: dozens of premade collections curated by us, and a friendly
            editor to build your own — anywhere in the Mitten or the U.P.
          </p>
          <p>
            We speak standard formats. Every map you build can be exported as <strong>GeoJSON</strong>
            or <strong>KML</strong>, so you can plug it into Google Earth, QGIS, ArcGIS, your blog, or
            your own app. You can also import existing files and keep editing.
          </p>
          <p>
            Publish a map and it shows up in the community atlas for everyone to enjoy. Keep it
            private and it's just yours.
          </p>
        </div>
        <div className="mt-10 flex gap-3">
          <Button asChild size="lg"><Link to="/explore">Explore the atlas</Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/builder">Open the builder</Link></Button>
        </div>
      </article>
    </div>
  );
}
