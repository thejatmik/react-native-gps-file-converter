import { XMLBuilder as Builder, XMLParser as Parser } from 'fast-xml-parser';

export const FeatureXMLParser = new Parser({
  attributeNamePrefix: '@_',
  ignoreAttributes: false,
});

export const CollectionXMLBuilder = new Builder({
  attributeNamePrefix: '@_',
  ignoreAttributes: false,
});

export const FeatureXMLBuilder = new Builder({
  attributeNamePrefix: '@_',
  ignoreAttributes: false,
  oneListGroup: true,
});
