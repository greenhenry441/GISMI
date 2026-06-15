import { createFileRoute, Link, useRouter, useSearch } from "@tanstack/react-router";
import { useEffect, useState, Suspense, lazy } from "react";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Download, Upload, Save, Globe, Lock } from "lucide-react";
import { downloadFile, geojsonToKml, kmlTextToGeoJSON } from "@/lib/kml";
import { saveMap, getMyMap } from "@/lib/maps.functions";
import { toast } from "sonner";

const MapBuilder = lazy(() => import("@/components/MapBuilder"));

const searchSchema = z.object({ id: z.string().uuid().optional() });

export const Route = createFileRoute("/_authenticated/builder")({
  ssr: false,
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Map Builder — GISMI" }] }),
  component: Builder,
});

const EMPTY: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: [] };

function Builder() {
  const router = useRouter();
  const { id } = useSearch({ from: "/_authenticated/builder" });
  const [title, setTitle] = useState("Untitled Michigan map");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [fc, setFc] = useState<GeoJSON.FeatureCollection>(EMPTY);
  const [center, setCenter] = useState<[number, number]>([44.3148, -85.6024]);
  const [zoom, setZoom] = useState(7);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!id);

  useEffect(() => {
    if (!id) return;
    getMyMap({ data: { id } }).then((m) => {
      if (m) {
        setTitle(m.title);
        setDescription(m.description ?? "");
        setCategory(m.category ?? "");
        setIsPublic(m.is_public);
        setFc(m.geojson as unknown as GeoJSON.FeatureCollection);
        setCenter([m.center_lat, m.center_lng]);
        setZoom(m.zoom);
      }
      setLoaded(true);
    });
  }, [id]);

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      let imported: GeoJSON.FeatureCollection;
      if (file.name.toLowerCase().endsWith(".kml")) {
        imported = await kmlTextToGeoJSON(text);
      } else {
        const parsed = JSON.parse(text);
        if (parsed.type === "Feature") imported = { type: "FeatureCollection", features: [parsed] };
        else if (parsed.type === "FeatureCollection") imported = parsed;
        else throw new Error("Not a valid GeoJSON file");
      }
      setFc({ type: "FeatureCollection", features: [...fc.features, ...imported.features] });
      toast.success(`Imported ${imported.features.length} features`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await saveMap({
        data: {
          id, title, description: description || null, category: category || null,
          geojson: fc, center_lat: center[0], center_lng: center[1], zoom, is_public: isPublic,
        },
      });
      toast.success("Map saved");
      if (!id && saved) router.navigate({ to: "/builder", search: { id: saved.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  };

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 shrink-0 overflow-y-auto border-r border-border bg-card p-5">
          <h2 className="font-display text-xl font-bold">Map details</h2>

          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="cat">Category</Label>
              <Input id="cat" placeholder="e.g. Trails, Food, History" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-2">
                {isPublic ? <Globe className="h-4 w-4 text-lake" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                <div>
                  <Label htmlFor="pub" className="cursor-pointer">{isPublic ? "Public" : "Private"}</Label>
                  <p className="text-xs text-muted-foreground">{isPublic ? "Visible in community atlas" : "Only you can see this"}</p>
                </div>
              </div>
              <Switch id="pub" checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>

          <div className="my-5 h-px bg-border" />

          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Import</h3>
          <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-background py-4 text-sm text-muted-foreground hover:border-accent hover:text-foreground">
            <Upload className="h-4 w-4" />GeoJSON or KML
            <input type="file" accept=".geojson,.json,.kml" className="hidden" onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])} />
          </label>

          <h3 className="mt-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Export</h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => downloadFile(`${title}.geojson`, JSON.stringify(fc, null, 2), "application/geo+json")}>
              <Download className="mr-1 h-3.5 w-3.5" />GeoJSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadFile(`${title}.kml`, geojsonToKml(fc, title), "application/vnd.google-earth.kml+xml")}>
              <Download className="mr-1 h-3.5 w-3.5" />KML
            </Button>
          </div>

          <Button onClick={handleSave} disabled={saving || !title} className="mt-6 w-full" size="lg">
            <Save className="mr-2 h-4 w-4" />{saving ? "Saving…" : id ? "Update map" : "Save map"}
          </Button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            <Link to="/my-maps" className="hover:underline">← My maps</Link>
          </p>
        </aside>

        <main className="flex-1">
          {loaded ? (
            <Suspense fallback={<div className="h-full bg-mist" />}>
              <MapBuilder
                geojson={fc}
                onChange={setFc}
                initialCenter={center}
                initialZoom={zoom}
                onViewChange={(c, z) => { setCenter(c); setZoom(z); }}
              />
            </Suspense>
          ) : (
            <div className="grid h-full place-items-center text-muted-foreground">Loading map…</div>
          )}
        </main>
      </div>
    </div>
  );
}
