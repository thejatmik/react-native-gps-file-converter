import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import { lineString, point, featureCollection } from '@turf/helpers';
import { XMLBuilder } from 'fast-xml-parser';
import {
  multiply,
  pointToWaypoint,
  linestringToTrack,
  featureCollectionToGPX,
  gpxStringToFeatureCollection,
} from 'react-native-gps-file-converter';
import type { Feature, LineString, Point } from 'geojson';

const GPX1 =
  '<?xml version="1.0" encoding="UTF-8" standalone="no" ?><gpx creator="Geomaplib" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" version="1.1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"><metadata><desc></desc><author><name>Geomaplib</name></author><link href=""><text>Geomaplib</text><type>text/html</type></link></metadata><wpt lon="110" lat="18"><name>point1</name></wpt><wpt lon="111" lat="18"><name>point2</name></wpt><trk><trkseg><trkpt lon="110" lat="-7"></trkpt><trkpt lon="111" lat="-7"></trkpt><trkpt lon="112" lat="-7"></trkpt></trkseg></trk><trk><trkseg><trkpt lon="110" lat="-7"></trkpt><trkpt lon="111" lat="-7"></trkpt><trkpt lon="112" lat="-7"></trkpt></trkseg></trk></gpx>';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  const dumpXML = (data: any) => {
    console.log(data);
    const builder = new XMLBuilder({
      attributeNamePrefix: '@_',
      ignoreAttributes: false,
      oneListGroup: true,
    });
    const xml = builder.build(data);
    console.log(xml);
  };

  const handleExample1 = () => {
    const mark1 = point([110, 18], { name: 'point1' });
    const data = pointToWaypoint(mark1);
    dumpXML(data);
  };

  const handleExample2 = () => {
    const line1 = lineString(
      [
        [110, -7],
        [111, -7],
        [112, -7],
      ],
      { name: 'line1' }
    );
    const data = linestringToTrack(line1);
    dumpXML(data);
  };

  const handleExample3 = () => {
    const mark1 = point([110, 18], { name: 'point1' });
    const line1 = lineString(
      [
        [110, -7],
        [111, -7],
        [112, -7],
      ],
      { name: 'line1' }
    );
    const features: Feature<LineString | Point, GeojsonParseProperties>[] = [
      mark1,
      line1,
    ];
    const collection = featureCollection(features);
    const xml = featureCollectionToGPX(collection);
    console.log(xml);
  };

  const handleExample4 = () => {
    gpxStringToFeatureCollection(GPX1);
  };

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <Button title="point to waypoint" onPress={handleExample1} />
      <Button title="line to track" onPress={handleExample2} />
      <Button title="collection to xml" onPress={handleExample3} />
      <Button title="gpx to collection" onPress={handleExample4} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
