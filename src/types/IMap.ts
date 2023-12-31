export type Position = number[];
export interface GeoJsonObject {
  type: string;
  properties?: Record<string, unknown>;
  geometry?: Geometry;
}

export interface Geometry {
  type: string;
  coordinates?: Position[];
}

export type SanityImage = {
  id: string;
  asset: {
    id: string;
    url: string;
    width: number;
    height: number;
    format: string;
    metadata: Record<string, unknown>;
  };
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  hotspot: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  caption: string;
  crediting: string;
};

export type PortableText = {
  _type: string;
  content: string;
  marks?: Record<string, Mark>;
};

export interface Mark {
  value: string;
  type: string;
}

export interface color {
  label: string;
  value: string;
}
interface GeoDataLayerOptions {
  // Replace 'any' with appropriate types for polygon/marker style properties
  polygonStyle?: {
    polygonOpacity: number;
    polygonColor: color;
    polygonLineWidth: number;
    polygonLineColor: color;
  };
  markerStyle?: {
    markerImageUrl: string;
    markerOpacity: number;
    markerColor: color;
  };
}

export interface GeoJsonObject {
  type: string;
  properties?: Record<string, unknown>;
  geometry?: Geometry;
}

export interface Geometry {
  type: string;
  coordinates?: Position[];
}

interface GeoData {
  geoJson: GeoJsonObject; // Replace 'File' with the correct type for 'file' field
  geoUrl: string;
  layerOptions: GeoDataLayerOptions;
}

interface CenterLocation {
  lat: number;
  lng: number;
}

export interface MapPoint {
  title: string;
  slug: string;
  _ref: string;
  Points: Array<MapPoint | undefined>;
  mainImage: SanityImage; // Replace 'Image' with the correct type for 'image' field
  body: PortableText; // Replace 'BlockContent' with the correct type for 'blockContent' field
  location: {
    center: CenterLocation;
    enableMarker: boolean;
    bearing: number;
    pitch: number;
    zoom: number;
  };
  enable: boolean;
  geoData: GeoData;
}

export interface MapPointMarker {
  title: string;

  slug: string;
  Points: Array<MapPoint | undefined>;
}
