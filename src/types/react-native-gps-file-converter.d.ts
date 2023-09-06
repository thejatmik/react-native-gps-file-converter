// time format 2023-09-05T06:36:14.853Z
type KMLCoordinate = [number, number, number?]; // lon, lat, ele

type GeojsonParseProperties =
  | {
      name: string;
      description?: string;
      time?: string;
      bbox?: BBox;
    } & Record<string, any>;

type GPXCoordinate = {
  '@_lat': number;
  '@_lon': number;
  'ele'?: number;
};

// {"@_lat": "18", "@_lon": "110", "name": "point1"}
interface Waypoint extends GPXCoordinate {
  // wpt
  name: string;
  desc?: string;
}
type GPXWaypoint = {
  wpt: Waypoint;
};
type ParsedWaypoint = {
  wpt: Waypoint[] | Waypoint;
};

interface GPXTrackpoint extends GPXCoordinate {
  // trkpt
  time?: string;
}
type GPXTrackSegment = { trkpt: GPXTrackpoint }[]; // trkseg
type ParsedTrackSegment = {
  trkseg: {
    trkpt: GPXTrackpoint[] | GPXTrackpoint;
  };
};

type Track = {
  // trk
  trkseg: GPXTrackSegment;
};
type GPXTrack = {
  trk: Track;
};
type ParsedTrack = {
  trk: ParsedTrackSegment[] | ParsedtrackSegment;
};

type Metadata = {
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
type GPXMetadata = {
  metadata: Metadata;
};

type GPXHeader = {
  '@_creator': string;
  '@_version': string;
  '@_xmlns': string;
  '@_xmlns:xsi': string;
  '@_xsi:schemaLocation': string;
  'metadata': GPXMetadata;
};
