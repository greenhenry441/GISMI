/// <reference types="geojson" />
// Premade Michigan map collections. Each is a FeatureCollection plus display metadata.
export type PremadeMap = {
  slug: string;
  title: string;
  description: string;
  category: string;
  center: [number, number];
  zoom: number;
  emoji: string;
  geojson: GeoJSON.FeatureCollection;
};

const point = (name: string, lng: number, lat: number, extra: Record<string, unknown> = {}): GeoJSON.Feature => ({
  type: "Feature",
  properties: { name, ...extra },
  geometry: { type: "Point", coordinates: [lng, lat] },
});

export const PREMADE_MAPS: PremadeMap[] = [
  {
    slug: "great-lakes",
    title: "The Great Lakes",
    description: "The five inland seas that define Michigan's borders.",
    category: "Geography",
    center: [44.5, -85.5], zoom: 6, emoji: "🌊",
    geojson: { type: "FeatureCollection", features: [
      point("Lake Superior", -87.5, 47.7, { area_km2: 82100 }),
      point("Lake Michigan", -87.0, 43.5, { area_km2: 58000 }),
      point("Lake Huron", -82.4, 44.8, { area_km2: 59600 }),
      point("Lake Erie", -81.2, 42.2, { area_km2: 25700 }),
      point("Lake Ontario", -77.8, 43.7, { area_km2: 19000 }),
    ]},
  },
  {
    slug: "major-cities",
    title: "Major Michigan Cities",
    description: "The state's largest population centers, peninsula to peninsula.",
    category: "Cities",
    center: [44.3, -85.6], zoom: 7, emoji: "🏙️",
    geojson: { type: "FeatureCollection", features: [
      point("Detroit", -83.0458, 42.3314, { pop: 633218 }),
      point("Grand Rapids", -85.6681, 42.9634, { pop: 198893 }),
      point("Warren", -83.0146, 42.5145, { pop: 139387 }),
      point("Sterling Heights", -83.0302, 42.5803, { pop: 134346 }),
      point("Ann Arbor", -83.7430, 42.2808, { pop: 123851 }),
      point("Lansing", -84.5555, 42.7325, { pop: 112644 }),
      point("Flint", -83.6875, 43.0125, { pop: 81252 }),
      point("Kalamazoo", -85.5872, 42.2917, { pop: 73598 }),
      point("Traverse City", -85.6206, 44.7631, { pop: 15678 }),
      point("Marquette", -87.3956, 46.5436, { pop: 20629 }),
      point("Sault Ste. Marie", -84.3475, 46.4953, { pop: 13337 }),
    ]},
  },
  {
    slug: "state-parks",
    title: "Iconic State Parks",
    description: "From dunes to waterfalls — Michigan's outdoor highlights.",
    category: "Outdoors",
    center: [45.5, -85.5], zoom: 6, emoji: "🌲",
    geojson: { type: "FeatureCollection", features: [
      point("Sleeping Bear Dunes", -86.0594, 44.8806, { type: "National Lakeshore" }),
      point("Pictured Rocks", -86.4731, 46.5594, { type: "National Lakeshore" }),
      point("Tahquamenon Falls SP", -85.2528, 46.5750),
      point("Porcupine Mountains SP", -89.7464, 46.7672),
      point("Mackinac Island SP", -84.6189, 45.8492),
      point("Isle Royale NP", -88.7831, 47.9959),
      point("Hartwick Pines SP", -84.6553, 44.7575),
      point("Warren Dunes SP", -86.5942, 41.9047),
      point("Holland State Park", -86.2056, 42.7747),
    ]},
  },
  {
    slug: "lighthouses",
    title: "Michigan Lighthouses",
    description: "More lighthouses than any other state — here are some classics.",
    category: "History",
    center: [44.8, -84.5], zoom: 6, emoji: "🗼",
    geojson: { type: "FeatureCollection", features: [
      point("Big Sable Point Light", -86.5142, 44.0578, { year: 1867 }),
      point("Au Sable Light Station", -86.1389, 46.6722, { year: 1874 }),
      point("Point Betsie Light", -86.2606, 44.6906, { year: 1858 }),
      point("Old Mackinac Point Light", -84.7281, 45.7864, { year: 1892 }),
      point("Whitefish Point Light", -84.9558, 46.7706, { year: 1849 }),
      point("Holland Harbor (Big Red)", -86.2128, 42.7736, { year: 1907 }),
      point("Eagle Harbor Light", -88.1606, 47.4625, { year: 1851 }),
      point("Round Island Light", -84.6286, 45.8350, { year: 1895 }),
    ]},
  },
  {
    slug: "craft-breweries",
    title: "Craft Brewery Trail",
    description: "A starter route through Michigan's beer cities.",
    category: "Food & Drink",
    center: [42.95, -85.5], zoom: 7, emoji: "🍺",
    geojson: { type: "FeatureCollection", features: [
      point("Founders Brewing (Grand Rapids)", -85.6644, 42.9583),
      point("Bell's Brewery (Kalamazoo)", -85.5742, 42.2920),
      point("Short's Brewing (Bellaire)", -85.2106, 44.9789),
      point("New Holland Brewing (Holland)", -86.1083, 42.7892),
      point("Atwater Brewery (Detroit)", -83.0244, 42.3403),
      point("Jolly Pumpkin (Dexter)", -83.8889, 42.3367),
      point("Arcadia Ales (Kalamazoo)", -85.5781, 42.2895),
    ]},
  },
  {
    slug: "upper-peninsula",
    title: "U.P. Adventure Spots",
    description: "Wild north — falls, peaks, and shoreline.",
    category: "Outdoors",
    center: [46.4, -86.8], zoom: 7, emoji: "🏞️",
    geojson: { type: "FeatureCollection", features: [
      point("Tahquamenon Falls", -85.2528, 46.5750),
      point("Pictured Rocks Cliffs", -86.5333, 46.5750),
      point("Kitch-iti-kipi (Big Spring)", -86.3839, 46.0033),
      point("Mount Arvon (Highest point)", -88.1547, 46.7556),
      point("Copper Harbor", -87.8889, 47.4719),
      point("Marquette Ore Dock", -87.3736, 46.5436),
      point("Bond Falls", -89.1339, 46.4111),
    ]},
  },
];

export const getPremade = (slug: string) => PREMADE_MAPS.find((m) => m.slug === slug);
