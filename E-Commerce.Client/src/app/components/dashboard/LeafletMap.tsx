import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, Globe } from 'lucide-react';

interface LeafletMapProps {
  accent?: string;
  title?: string;
  subtitle?: string;
}

const COUNTRY_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'Turkey':                { lat: 39.0,  lng: 35.0,   zoom: 6 },
  'United States of America': { lat: 38.5, lng: -96.0, zoom: 4 },
  'Russia':                { lat: 61.0,  lng: 100.0,  zoom: 3 },
  'Germany':               { lat: 51.5,  lng: 10.0,   zoom: 6 },
  'United Kingdom':        { lat: 54.0,  lng: -2.0,   zoom: 6 },
  'France':                { lat: 46.5,  lng: 2.0,    zoom: 6 },
  'Japan':                 { lat: 36.5,  lng: 138.0,  zoom: 5 },
  'Azerbaijan':            { lat: 40.5,  lng: 47.5,   zoom: 7 },
  'China':                 { lat: 35.0,  lng: 105.0,  zoom: 4 },
  'Brazil':                { lat: -14.0, lng: -51.0,  zoom: 4 },
  'India':                 { lat: 20.0,  lng: 77.0,   zoom: 5 },
  'Australia':             { lat: -25.0, lng: 133.0,  zoom: 4 },
  'Canada':                { lat: 56.0,  lng: -96.0,  zoom: 4 },
  'Italy':                 { lat: 42.0,  lng: 12.5,   zoom: 6 },
  'Spain':                 { lat: 40.0,  lng: -3.7,   zoom: 6 },
  'South Africa':          { lat: -29.0, lng: 25.0,   zoom: 5 },
  'Egypt':                 { lat: 26.0,  lng: 30.0,   zoom: 6 },
  'Mexico':                { lat: 23.0,  lng: -102.0, zoom: 5 },
  'Indonesia':             { lat: -2.0,  lng: 118.0,  zoom: 5 },
  'Saudi Arabia':          { lat: 24.0,  lng: 45.0,   zoom: 6 },
  'Ukraine':               { lat: 49.0,  lng: 31.0,   zoom: 6 },
  'Poland':                { lat: 52.0,  lng: 19.0,   zoom: 6 },
  'Netherlands':           { lat: 52.3,  lng: 5.3,    zoom: 7 },
  'Argentina':             { lat: -34.0, lng: -64.0,  zoom: 4 },
  'Iran':                  { lat: 32.0,  lng: 53.0,   zoom: 5 },
};

export function LeafletMap({
  accent = '#00f5ff',
  title = 'Global Order Map',
  subtitle = 'Click any country to zoom in',
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const geoLayerRef = useRef<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const resetView = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.flyTo([20, 0], 2, { duration: 1 });
    }
    setSelectedCountry(null);
  }, []);

  const zoomIn = useCallback(() => mapRef.current?.zoomIn(), []);
  const zoomOut = useCallback(() => mapRef.current?.zoomOut(), []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Dynamic import to avoid SSR issues
    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

      // Fix icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current!, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false,
        worldCopyJump: true,
        attributionControl: false,
      });

      // Dark CartoDB tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Attribution small
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('<a href="https://carto.com" style="color:rgba(224,247,255,0.3);font-size:9px">© CARTO</a>')
        .addTo(map);

      mapRef.current = map;
      setLoading(false);

      // Load GeoJSON
      fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then(r => r.json())
        .then(data => {
          const geoLayer = L.geoJSON(data, {
            style: () => ({
              fillColor: accent + '18',
              fillOpacity: 0.3,
              color: accent + '35',
              weight: 0.5,
            }),
            onEachFeature: (feature, layer: any) => {
              const name: string = feature.properties?.ADMIN || feature.properties?.name || '';

              layer.on({
                mouseover() {
                  layer.setStyle({ fillColor: accent + '35', fillOpacity: 0.5, color: accent, weight: 1 });
                  layer.bindTooltip(
                    `<div style="background:rgba(2,4,8,0.92);border:1px solid ${accent}50;border-radius:5px;padding:4px 10px;font-family:DM Sans,sans-serif;font-size:12px;font-weight:600;color:${accent}">${name}</div>`,
                    { sticky: true, opacity: 1, className: '' }
                  ).openTooltip();
                },
                mouseout() {
                  geoLayer.resetStyle(layer);
                  layer.closeTooltip();
                },
                click() {
                  const center = COUNTRY_CENTERS[name];
                  if (center) {
                    map.flyTo([center.lat, center.lng], center.zoom, { duration: 1.2 });
                  } else {
                    try {
                      const bounds = layer.getBounds();
                      map.flyToBounds(bounds, { padding: [40, 40], duration: 1.2, maxZoom: 8 });
                    } catch {}
                  }
                  setSelectedCountry(name);
                },
              });
            },
          }).addTo(map);
          geoLayerRef.current = geoLayer;
        })
        .catch(() => {});
    }).catch(() => {});

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [accent]);

  return (
    <div
      className="rounded flex flex-col overflow-hidden"
      style={{
        background: 'rgba(0,245,255,0.04)',
        border: `1px solid ${accent}15`,
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{ borderBottom: `1px solid ${accent}10` }}
      >
        <div>
          <p
            style={{
              color: accent,
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '0.04em',
              textShadow: `0 0 10px ${accent}50`,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {selectedCountry ? `📍 ${selectedCountry}` : title}
          </p>
          <p style={{ color: 'rgba(224,247,255,0.4)', fontSize: 11 }} className="mt-0.5">
            {selectedCountry ? 'Scroll to zoom · Drag to pan' : subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedCountry && (
            <button
              onClick={resetView}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded transition-all"
              style={{ color: accent, border: `1px solid ${accent}30`, background: `${accent}08` }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}18`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}08`; }}
            >
              <Globe size={11} /> World
            </button>
          )}
          <button
            onClick={zoomIn}
            className="w-7 h-7 flex items-center justify-center rounded transition-all"
            style={{ color: 'rgba(224,247,255,0.5)', border: `1px solid ${accent}15` }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = accent; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(224,247,255,0.5)'; }}
          >
            <ZoomIn size={13} />
          </button>
          <button
            onClick={zoomOut}
            className="w-7 h-7 flex items-center justify-center rounded transition-all"
            style={{ color: 'rgba(224,247,255,0.5)', border: `1px solid ${accent}15` }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = accent; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(224,247,255,0.5)'; }}
          >
            <ZoomOut size={13} />
          </button>
        </div>
      </div>

      {/* Leaflet dark overrides */}
      <style>{`
        .leaflet-container { background: #020c18 !important; }
        .leaflet-control-attribution {
          background: rgba(2,4,8,0.75) !important;
          color: rgba(224,247,255,0.3) !important;
          border: none !important;
          box-shadow: none !important;
          font-size: 9px !important;
          padding: 2px 6px !important;
        }
        .leaflet-control-attribution a { color: rgba(0,245,255,0.4) !important; }
        .leaflet-control-zoom { display: none !important; }
        .leaflet-tile-pane { filter: brightness(0.92); }
        .leaflet-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* Map */}
      <div style={{ position: 'relative', height: 340 }}>
        {loading && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ background: '#020c18' }}
          >
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: `${accent}30`, borderTopColor: accent }}
            />
          </div>
        )}
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '100%', background: '#020c18' }}
        />
      </div>

      {/* Legend */}
      <div
        className="flex items-center justify-between px-5 py-2 shrink-0"
        style={{ borderTop: `1px solid ${accent}08` }}
      >
        <span style={{ color: 'rgba(224,247,255,0.35)', fontSize: 11 }}>
          Scroll to zoom · Click any country to focus
        </span>
        <span style={{ color: `${accent}60`, fontSize: 11 }}>
          © CartoDB Dark Matter
        </span>
      </div>
    </div>
  );
}
