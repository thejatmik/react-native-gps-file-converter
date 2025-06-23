import type {
  FeatureCollection,
  Feature,
  LineString,
  Point,
  Position,
} from 'geojson';
import { lineString, point } from '@turf/helpers';

import GpsFileConverter from './NativeGpsFileConverter';
import { regexWpt, regexTrk, regexMetadata } from './regex';
import type {
  ParsedWaypoint,
  Waypoint,
  ParsedTrack,
  ParsedTrackSegment,
  GeojsonParseProperties,
  GPXTrackpoint,
  GPXWaypoint,
  GPXMetadata,
  Metadata,
  GPXTrack,
} from './types';
import {
  FeatureXMLBuilder,
  CollectionXMLBuilder,
  FeatureXMLParser,
} from './xml';

export function multiply(a: number, b: number): number {
  return GpsFileConverter.multiply(a, b);
}

export const gpxStringToFeatureCollection = (xml: string) => {
  const wptString = xml.match(regexWpt)?.at(0);
  const features: Feature[] = [];
  console.log(wptString);
  if (wptString) {
    const wptObject: ParsedWaypoint = FeatureXMLParser.parse(wptString);
    //  LOG  {"wpt": [{"@_lat": "18", "@_lon": "110", "name": "point1"}, {"@_lat": "18", "@_lon": "111", "name": "point2"}]}
    console.log(wptObject);
    if (wptObject.wpt && Array.isArray(wptObject.wpt) === false) {
      wptObject.wpt = [wptObject.wpt] as Waypoint[];
    }
    (wptObject.wpt as Waypoint[]).forEach((wpt) => {
      const feature = waypointToFeature(wpt);
      features.push(feature);
    });
  }
  const trkString = xml.match(regexTrk)?.at(0);
  console.log(trkString);
  if (trkString) {
    const trkObject: ParsedTrack = FeatureXMLParser.parse(trkString);
    console.log(JSON.stringify(trkObject));
    if (trkObject.trk && Array.isArray(trkObject.trk) === false) {
      trkObject.trk = [trkObject.trk] as ParsedTrackSegment[];
    }
    (trkObject.trk as ParsedTrackSegment[]).forEach((trk) => {
      const feature = trackToFeature(trk);
      features.push(feature);
    });
  }
  console.log(JSON.stringify(features));
  const metadataString = xml.match(regexMetadata)?.at(0);
  console.log(metadataString);
  if (metadataString) {
    const metadataObject = FeatureXMLParser.parse(metadataString);
    console.log(JSON.stringify(metadataObject));
  }
};

const waypointToFeature = (
  waypoint: Waypoint
): Feature<Point, GeojsonParseProperties> => {
  const coordinates = [Number(waypoint['@_lon']), Number(waypoint['@_lat'])];
  if (waypoint.ele) {
    coordinates.push(Number(waypoint.ele));
  }
  const properties: GeojsonParseProperties = {
    name: waypoint.name,
  };
  if (waypoint.desc) {
    properties.description = waypoint.desc;
  }
  const feature = point(coordinates, properties);
  return feature;
};

const trackToFeature = (
  track: ParsedTrackSegment
): Feature<LineString, GeojsonParseProperties> => {
  const coordinates: Position[] = [];
  const properties: Partial<GeojsonParseProperties> = {
    name: '',
  };
  if (track.trkseg) {
    const trackSegment = { ...track.trkseg };
    if (Array.isArray(trackSegment.trkpt) === false) {
      trackSegment.trkpt = [trackSegment.trkpt as GPXTrackpoint];
    }
    (trackSegment.trkpt as GPXTrackpoint[]).forEach((trkpt) => {
      const coordinate: Position = [
        Number(trkpt['@_lon']),
        Number(trkpt['@_lat']),
      ];
      if (trkpt.ele) {
        coordinate.push(Number(trkpt.ele));
      }
      if (trkpt.time) {
        properties.time = trkpt.time;
      }
      coordinates.push(coordinate);
    });
  }
  const feature = lineString(coordinates, properties);
  return feature as Feature<LineString, GeojsonParseProperties>;
};

export const pointToWaypoint = (
  point_: Feature<Point, GeojsonParseProperties>
): GPXWaypoint => {
  const waypoint: Partial<Waypoint> = {};
  const geometry = point_.geometry;
  const properties = point_?.properties || {};
  waypoint['@_lon'] = geometry.coordinates[0];
  waypoint['@_lat'] = geometry.coordinates[1];
  if (geometry.coordinates[2]) {
    waypoint.ele = geometry.coordinates[2];
  }
  waypoint.name = properties.name || '';
  if (properties.description) {
    waypoint.desc = properties.description;
  }
  return { wpt: waypoint as Waypoint };
};

export const linestringToTrack = (
  line: Feature<LineString, GeojsonParseProperties>
): GPXTrack => {
  const geometry = line.geometry;
  // 'time' in LineString properties is last point acquisition time
  // while 'time' in Trackpoint is acquisition time for each point
  // const properties = line.properties;
  const trackSegment = geometry.coordinates.map((pos) => {
    const trackPoint: Partial<GPXTrackpoint> = {};
    trackPoint['@_lon'] = pos[0];
    trackPoint['@_lat'] = pos[1];
    if (pos[2]) {
      trackPoint.ele = pos[2];
    }
    return { trkpt: trackPoint as GPXTrackpoint };
  });
  return {
    trk: {
      trkseg: trackSegment,
    },
  };
};

const featurePropertiesToMetadata = (
  properties: GeojsonParseProperties // feature properties
): GPXMetadata => {
  const metadata: Partial<Metadata> = {};

  metadata.name = properties.name;
  metadata.desc = properties.description || '';
  metadata.author = {
    name: properties.author || 'Geomaplib',
  };
  metadata.time = properties.time;
  if (properties.bbox) {
    metadata.bounds = {
      '@_minlon': properties.bbox[0],
      '@_minlat': properties.bbox[1],
      '@_maxlon': properties.bbox[2],
      '@_maxlat': properties.bbox[3],
    };
  }
  metadata.link = {
    '@_href': '',
    'text': 'Geomaplib',
    'type': 'text/html',
  };

  return { metadata: metadata as Metadata };
};

export const featureCollectionToGPX = (
  collection: FeatureCollection<Point | LineString, GeojsonParseProperties>
): string => {
  const features = collection.features;
  let metadata: Partial<GeojsonParseProperties> = {};
  // gpxOpen: string of <?xml tag and <gpx> opening tag
  // gpxMeta: string of <metadata> content
  // string of features as <wpt> and <trk>
  // gpxClose: string of </gpx> closing tag
  let wptString = '';
  let trkString = '';
  features.forEach((feat) => {
    if (feat.geometry.type === 'Point') {
      const waypoint = pointToWaypoint(
        feat as Feature<Point, GeojsonParseProperties>
      );
      metadata = Object.assign(
        metadata,
        featurePropertiesToMetadata(feat.properties)
      );
      wptString += FeatureXMLBuilder.build(waypoint);
    }
    if (feat.geometry.type === 'LineString') {
      const track = linestringToTrack(
        feat as Feature<LineString, GeojsonParseProperties>
      );
      metadata = Object.assign(
        metadata,
        featurePropertiesToMetadata(feat.properties)
      );
      trkString += FeatureXMLBuilder.build(track);
    }
    console.log(feat.properties, 'feat prop');
  });
  const gpxOpen =
    '<?xml version="1.0" encoding="UTF-8" standalone="no" ?><gpx creator="Geomaplib" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" version="1.1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">';
  const gpxClose = '</gpx>';
  const gpxMeta = featurePropertiesToMetadata(
    metadata as GeojsonParseProperties
  );
  console.log(gpxMeta, 'gpxmeta');
  const gpxMetaStr = FeatureXMLBuilder.build(gpxMeta);
  const xmlString = gpxOpen + gpxMetaStr + wptString + trkString + gpxClose;
  return xmlString;
};

export default {
  pointToWaypoint,
  linestringToTrack,
  featurePropertiesToMetadata,
  featureCollectionToGPX,
  FeatureXMLBuilder,
  CollectionXMLBuilder,
  gpxStringToFeatureCollection,
  waypointToFeature,
  trackToFeature,
};
