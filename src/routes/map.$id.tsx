import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { getMap } from "@/lib/maps.functions";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { lazy, Suspense } from "react";
import { downloadFile, geojsonToKml } from "@/lib/kml";

const MapView = lazy(() => import("@/components/MapView"));

const mapQuery = (id: string) =>
  queryOptions({
    queryKey: ["map", id],
    queryFn: () => getMap({ data: { id } }),
  });

export const Route = createFileRoute("/map/$id")({
  ssr: false,
  loader: async ({ context, params }) => {
    const map = await context.queryClient.ensureQueryData(mapQuery(params.id));
    if (!map) throw notFound();
    return map;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Map"} — GISMI` },
      { name: "description", content: loaderData?.description ?? "A community Michigan map on GISMI." },
    ],
  }),
  component: ViewSavedMap,
  errorComponent: () => <NotFound />,
  notFoundComponent: () => <NotFound />,
});

function ViewSavedMap() {
  const { id } = Route.useParams();
  const { data: m } = useSuspenseQuery(mapQuery(id));
  if (!m) return <NotFound />;

  const fc = m.geojson as unknown as GeoJSON.FeatureCollection;
  const downloadGeoJSON = () => downloadFile(`${m.title}.geojson`, JSON.stringify(fc, null, 2), "application/geo+json");
  const downloadKML = () => downloadFile(`${m.title}.kml`, geojsonToKml(fc, m.title), "application/vnd.google-earth.kml+xml");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Link to="/explore" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />Back to atlas
        </Link>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            {m.category && <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">{m.category}</span>}
            <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{m.title}</h1>
            {m.description && <p className="mt-1 max-w-2xl text-muted-foreground">{m.description}</p>}
            <p className="mt-1 text-xs text-muted-foreground">{fc.features.length} features · shared {new Date(m.created_at).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadGeoJSON}><Download className="mr-2 h-4 w-4" />GeoJSON</Button>
            <Button variant="outline" onClick={downloadKML}><Download className="mr-2 h-4 w-4" />KML</Button>
          </div>
        </div>
        <div className="h-[70vh] overflow-hidden rounded-2xl border border-border shadow-lg">
          <Suspense fallback={<div className="h-full bg-mist" />}>
            <MapView geojson={fc} center={[m.center_lat, m.center_lng]} zoom={m.zoom} className="h-full" />
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
        <p className="mt-2 text-muted-foreground">It's private or no longer exists.</p>
        <Button asChild className="mt-4"><Link to="/explore">Back to atlas</Link></Button>
      </div>
    </div>
  );
}
