import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { getPremade } from "@/lib/premade-maps";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { lazy, Suspense } from "react";
import { downloadFile, geojsonToKml } from "@/lib/kml";

const MapView = lazy(() => import("@/components/MapView"));

export const Route = createFileRoute("/premade/$slug")({
  ssr: false,
  loader: ({ params }) => {
    const map = getPremade(params.slug);
    if (!map) throw notFound();
    return map;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Map"} — GISMI` },
      { name: "description", content: loaderData?.description ?? "A Michigan map from the GISMI atlas." },
    ],
  }),
  component: PremadeView,
  errorComponent: () => <NotFound />,
  notFoundComponent: () => <NotFound />,
});

function PremadeView() {
  const m = Route.useLoaderData();

  const downloadGeoJSON = () => {
    downloadFile(`${m.slug}.geojson`, JSON.stringify(m.geojson, null, 2), "application/geo+json");
  };
  const downloadKML = () => {
    downloadFile(`${m.slug}.kml`, geojsonToKml(m.geojson, m.title), "application/vnd.google-earth.kml+xml");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Link to="/explore" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />Back to atlas
        </Link>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{m.emoji}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">{m.category}</span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{m.title}</h1>
            <p className="mt-1 max-w-2xl text-muted-foreground">{m.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadGeoJSON}><Download className="mr-2 h-4 w-4" />GeoJSON</Button>
            <Button variant="outline" onClick={downloadKML}><Download className="mr-2 h-4 w-4" />KML</Button>
          </div>
        </div>
        <div className="h-[70vh] overflow-hidden rounded-2xl border border-border shadow-lg">
          <Suspense fallback={<div className="h-full bg-mist" />}>
            <MapView geojson={m.geojson} center={m.center} zoom={m.zoom} className="h-full" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Map not found</h1>
        <p className="mt-2 text-muted-foreground">It might have moved.</p>
        <Button asChild className="mt-4"><Link to="/explore">Back to atlas</Link></Button>
      </div>
    </div>
  );
}
