/**
 * Слои
 * Версия 1.0
 */

var visiomaplayerCylosm = L.tileLayer(
  "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
  {
    attribution:
      '\u003ca href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render"\u003eCyclOSM\u003c/a\u003e | Map data: \u0026copy; \u003ca href="https://www.openstreetmap.org/copyright"\u003eOpenStreetMap\u003c/a\u003e contributors',
    detectRetina: false,
    maxNativeZoom: 20,
    maxZoom: 20,
    minZoom: 0,
    noWrap: false,
    opacity: 1,
    tms: false,
  }
);

var visiomaplayerGoogle = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s\u0026x={x}\u0026y={y}\u0026z={z}",
  {
    attribution: "google",
    detectRetina: false,
    maxNativeZoom: 20,
    maxZoom: 20,
    minZoom: 0,
    noWrap: false,
    opacity: 1,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
    tms: false,
  }
);

var visiomaplayerOSN = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      'Data by \u0026copy; \u003ca href="http://openstreetmap.org"\u003eOpenStreetMap\u003c/a\u003e, under \u003ca href="http://www.openstreetmap.org/copyright"\u003eODbL\u003c/a\u003e.',
    detectRetina: false,
    maxNativeZoom: 18,
    maxZoom: 18,
    minZoom: 0,
    noWrap: false,
    opacity: 1,
    subdomains: "abc",
    tms: false,
  }
);
