import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import { ensureLeafletIcons } from "@/lib/leaflet-setup";

ensureLeafletIcons();

type Props = {
  geojson: GeoJSON.FeatureCollection;
  center: [number, number];
  zoom: number;
  className?: string;
};

export default function MapView({ geojson, center, zoom, className }: Props) {
  // Force remount when key data changes
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className={className} style={{ background: "var(--mist)" }} />;

  const points = geojson.features.filter((f) => f.geometry?.type === "Point");
  const nonPoints = { type: "FeatureCollection" as const, features: geojson.features.filter((f) => f.geometry?.type !== "Point") };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className={className}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {nonPoints.features.length > 0 && (
        <GeoJSON
          data={nonPoints}
          style={() => ({ color: "#1e6091", weight: 3, fillColor: "#4dabf7", fillOpacity: 0.3 })}
        />
      )}
      {points.map((f, i) => {
        const c = (f.geometry as GeoJSON.Point).coordinates;
        const name = (f.properties?.name as string) ?? "Point";
        return (
          <Marker key={i} position={[c[1], c[0]]}>
            <Popup>
              <strong>{name}</strong>
              {f.properties?.description && <div>{String(f.properties.description)}</div>}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
