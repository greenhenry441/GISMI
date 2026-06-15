// GeoJSON ↔ KML helpers. KML parsing relies on @tmcw/togeojson (browser DOMParser).

export function geojsonToKml(fc: GeoJSON.FeatureCollection, name = "GISMI Map"): string {
  const placemarks = fc.features.map(featureToPlacemark).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
  <name>${esc(name)}</name>
${placemarks}
</Document>
</kml>`;
}

function esc(s: string) {
  return String(s).replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!),
  );
}

function coordString(c: number[]) {
  return `${c[0]},${c[1]}${c[2] != null ? "," + c[2] : ""}`;
}

function featureToPlacemark(f: GeoJSON.Feature): string {
  const name = (f.properties?.name as string) ?? "Untitled";
  const desc = (f.properties?.description as string) ?? "";
  const inner = geomToKml(f.geometry);
  return `  <Placemark>
    <name>${esc(name)}</name>
    ${desc ? `<description>${esc(desc)}</description>` : ""}
    ${inner}
  </Placemark>`;
}

function geomToKml(g: GeoJSON.Geometry | null): string {
  if (!g) return "";
  switch (g.type) {
    case "Point":
      return `<Point><coordinates>${coordString(g.coordinates)}</coordinates></Point>`;
    case "LineString":
      return `<LineString><coordinates>${g.coordinates.map(coordString).join(" ")}</coordinates></LineString>`;
    case "Polygon":
      return `<Polygon><outerBoundaryIs><LinearRing><coordinates>${g.coordinates[0].map(coordString).join(" ")}</coordinates></LinearRing></outerBoundaryIs></Polygon>`;
    case "MultiPoint":
    case "MultiLineString":
    case "MultiPolygon":
    case "GeometryCollection":
      return "";
    default:
      return "";
  }
}

export async function kmlTextToGeoJSON(text: string): Promise<GeoJSON.FeatureCollection> {
  const { kml } = await import("@tmcw/togeojson");
  const doc = new DOMParser().parseFromString(text, "text/xml");
  return kml(doc) as GeoJSON.FeatureCollection;
}

export function downloadFile(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
