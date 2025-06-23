import type { BBox } from 'geojson';
// time format 2023-09-05T06:36:14.853Z
export type KMLCoordinate = [number, number, number?]; // lon, lat, ele

export type GeojsonParseProperties = {
  name: string;
  description?: string;
  time?: string;
  bbox?: BBox;
} & Record<string, any>;

export type GPXCoordinate = {
  '@_lat': number;
  '@_lon': number;
  'ele'?: number;
};

// {"@_lat": "18", "@_lon": "110", "name": "point1"}
export interface Waypoint extends GPXCoordinate {
  // wpt
  name: string;
  desc?: string;
}
export type GPXWaypoint = {
  wpt: Waypoint;
};
export type ParsedWaypoint = {
  wpt: Waypoint[] | Waypoint;
};

export interface GPXTrackpoint extends GPXCoordinate {
  // trkpt
  time?: string;
}
export type GPXTrackSegment = { trkpt: GPXTrackpoint }[]; // trkseg
export type ParsedTrackSegment = {
  trkseg: {
    trkpt: GPXTrackpoint[] | GPXTrackpoint;
  };
};

// trk
export type Track = {
  trkseg: GPXTrackSegment;
};
export type GPXTrack = {
  trk: Track;
};
export type ParsedTrack = {
  trk: ParsedTrackSegment[] | ParsedTrackSegment;
};

export type Metadata = {
  name: string;
  desc: string;
  author: {
    name: string;
  };
  link: {
    '@_href': string;
    'text': string;
    'type': string;
  };
  time: string;
  bounds: {
    '@_minlat': number;
    '@_minlon': number;
    '@_maxlat': number;
    '@_maxlon': number;
  };
};
export type GPXMetadata = {
  metadata: Metadata;
};

export type GPXHeader = {
  '@_creator': string;
  '@_version': string;
  '@_xmlns': string;
  '@_xmlns:xsi': string;
  '@_xsi:schemaLocation': string;
  'metadata': GPXMetadata;
};
