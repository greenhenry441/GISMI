import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { ensureLeafletIcons } from "@/lib/leaflet-setup";
import { Button } from "@/components/ui/button";
import { MapPin, Spline, Hexagon, Trash2, Pencil } from "lucide-react";

ensureLeafletIcons();

export type DrawMode = "point" | "line" | "polygon" | "none";

type Props = {
  geojson: GeoJSON.FeatureCollection;
  onChange: (fc: GeoJSON.FeatureCollection) => void;
  initialCenter: [number, number];
  initialZoom: number;
  onViewChange?: (center: [number, number], zoom: number) => void;
};

export default function MapBuilder({ geojson, onChange, initialCenter, initialZoom, onViewChange }: Props) {
  const [mode, setMode] = useState<DrawMode>("none");
  const [draft, setDraft] = useState<[number, number][]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="flex-1 bg-mist" />;

  const finish = () => {
    if (draft.length === 0) return;
    let feature: GeoJSON.Feature | null = null;
    if (mode === "line" && draft.length >= 2) {
      feature = {
        type: "Feature",
        properties: { name: `Line ${geojson.features.length + 1}` },
        geometry: { type: "LineString", coordinates: draft.map(([lat, lng]) => [lng, lat]) },
      };
    } else if (mode === "polygon" && draft.length >= 3) {
      const ring = [...draft, draft[0]].map(([lat, lng]) => [lng, lat]);
      feature = {
        type: "Feature",
        properties: { name: `Area ${geojson.features.length + 1}` },
        geometry: { type: "Polygon", coordinates: [ring] },
      };
    }
    if (feature) onChange({ ...geojson, features: [...geojson.features, feature] });
    setDraft([]);
  };

  const addPoint = (lat: number, lng: number) => {
    const name = prompt("Name this point", `Point ${geojson.features.length + 1}`);
    if (name === null) return;
    const feature: GeoJSON.Feature = {
      type: "Feature",
      properties: { name: name || `Point ${geojson.features.length + 1}` },
      geometry: { type: "Point", coordinates: [lng, lat] },
    };
    onChange({ ...geojson, features: [...geojson.features, feature] });
  };

  const removeFeature = (idx: number) => {
    onChange({ ...geojson, features: geojson.features.filter((_, i) => i !== idx) });
  };

  const points = geojson.features.map((f, i) => ({ f, i })).filter((x) => x.f.geometry?.type === "Point");
  const lines = geojson.features.map((f, i) => ({ f, i })).filter((x) => x.f.geometry?.type === "LineString");
  const polygons = geojson.features.map((f, i) => ({ f, i })).filter((x) => x.f.geometry?.type === "Polygon");

  return (
    <div className="relative h-full w-full">
      {/* Toolbar */}
      <div className="absolute left-3 top-3 z-[1000] flex flex-col gap-2 rounded-lg border border-border bg-card/95 p-2 shadow-lg backdrop-blur">
        <ToolBtn active={mode === "point"} onClick={() => { setMode("point"); setDraft([]); }} icon={<MapPin className="h-4 w-4" />} label="Point" />
        <ToolBtn active={mode === "line"} onClick={() => { setMode("line"); setDraft([]); }} icon={<Spline className="h-4 w-4" />} label="Line" />
        <ToolBtn active={mode === "polygon"} onClick={() => { setMode("polygon"); setDraft([]); }} icon={<Hexagon className="h-4 w-4" />} label="Polygon" />
        <ToolBtn active={mode === "none"} onClick={() => { setMode("none"); setDraft([]); }} icon={<Pencil className="h-4 w-4 rotate-180" />} label="View" />
        {(mode === "line" || mode === "polygon") && draft.length > 0 && (
          <Button size="sm" variant="default" onClick={finish}>Finish</Button>
        )}
      </div>

      {/* Feature list */}
      {geojson.features.length > 0 && (
        <div className="absolute right-3 top-3 z-[1000] max-h-[60vh] w-64 overflow-auto rounded-lg border border-border bg-card/95 p-2 shadow-lg backdrop-blur">
          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">FEATURES ({geojson.features.length})</div>
          {geojson.features.map((f, i) => (
            <div key={i} className="flex items-center justify-between gap-2 rounded px-2 py-1 text-sm hover:bg-muted">
              <span className="truncate">{(f.properties?.name as string) ?? f.geometry?.type ?? "Feature"}</span>
              <button onClick={() => removeFeature(i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      )}

      {mode !== "none" && (
        <div className="absolute bottom-3 left-1/2 z-[1000] -translate-x-1/2 rounded-full bg-deep px-4 py-2 text-xs font-medium text-mist shadow">
          {mode === "point" ? "Click map to drop a point" : `Click to add vertices (${draft.length}). Then press Finish.`}
        </div>
      )}

      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ViewTracker onChange={onViewChange} />
        <ClickHandler mode={mode} onPoint={addPoint} onDraft={(pt) => setDraft((d) => [...d, pt])} />

        {points.map(({ f, i }) => {
          const c = (f.geometry as GeoJSON.Point).coordinates;
          return (
            <Marker key={`p${i}`} position={[c[1], c[0]]}>
              <Popup><strong>{(f.properties?.name as string) ?? "Point"}</strong></Popup>
            </Marker>
          );
        })}
        {lines.map(({ f, i }) => {
          const coords = (f.geometry as GeoJSON.LineString).coordinates.map((c) => [c[1], c[0]] as [number, number]);
          return <Polyline key={`l${i}`} positions={coords} pathOptions={{ color: "#1e6091", weight: 4 }} />;
        })}
        {polygons.map(({ f, i }) => {
          const coords = (f.geometry as GeoJSON.Polygon).coordinates[0].map((c) => [c[1], c[0]] as [number, number]);
          return <Polygon key={`pg${i}`} positions={coords} pathOptions={{ color: "#1e6091", fillColor: "#4dabf7", fillOpacity: 0.35 }} />;
        })}
        {draft.length > 0 && mode === "line" && (
          <Polyline positions={draft} pathOptions={{ color: "#e85d3a", weight: 3, dashArray: "6 6" }} />
        )}
        {draft.length > 0 && mode === "polygon" && (
          <Polygon positions={draft} pathOptions={{ color: "#e85d3a", fillColor: "#e85d3a", fillOpacity: 0.2, dashArray: "6 6" }} />
        )}
        {draft.map((p, i) => (
          <Marker key={`d${i}`} position={p} icon={L.divIcon({ className: "", html: '<div style="width:10px;height:10px;background:#e85d3a;border:2px solid white;border-radius:50%;box-shadow:0 0 0 1px #e85d3a"></div>', iconSize: [10, 10] })} />
        ))}
      </MapContainer>
    </div>
  );
}

function ToolBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-24 items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}
    >
      {icon}<span>{label}</span>
    </button>
  );
}

function ClickHandler({ mode, onPoint, onDraft }: { mode: DrawMode; onPoint: (lat: number, lng: number) => void; onDraft: (pt: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      if (mode === "point") onPoint(e.latlng.lat, e.latlng.lng);
      else if (mode === "line" || mode === "polygon") onDraft([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function ViewTracker({ onChange }: { onChange?: (center: [number, number], zoom: number) => void }) {
  const map = useMap();
  const ref = useRef(onChange);
  ref.current = onChange;
  useMapEvents({
    moveend() {
      const c = map.getCenter();
      ref.current?.([c.lat, c.lng], map.getZoom());
    },
  });
  return null;
}
