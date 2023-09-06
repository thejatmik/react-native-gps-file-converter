// match <gpx> opening tag including attibutes
export const regexGpxOpen = /(<gpx.\s*[^>]+>){1}/;

// match <metadata></metadata> including content and attributes
export const regexMetadata =
  /<metadata.\s*[<>A-Za-z0-9.\-\)\(\[\]/\s=':"]+metadata>/;

// match <wpt></wpt> including content and attributes
// might match multiple <wpt> tag in sequence as well
export const regexWpt = /<wpt.\s*[<>A-Za-z0-9.\-\)\(\[\]/\s=':"]+wpt>/;

// match <trk></trk> including content and attributes
// match multiple <trk> tag in sequence as well
export const regexTrk = /<trk.\s*[<>A-Za-z0-9.\-\)\(\[\]/\s=':"]+trk>/;

// match multiple whitespace
export const regexMultipleWhitespace = /\s\s+/;
