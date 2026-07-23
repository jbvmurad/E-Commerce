import { useState, useCallback } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { ArrowLeft, ZoomIn, ZoomOut } from 'lucide-react';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface WorldMapProps {
  accent?: string;
  title?: string;
  subtitle?: string;
  valueLabel?: string;
}

interface MapPosition {
  coordinates: [number, number];
  zoom: number;
}

export function WorldMap({
  accent = '#00f5ff',
  title = 'Global Order Map',
  subtitle = 'Click any country to explore',
}: WorldMapProps) {
  const [position, setPosition] = useState<MapPosition>({ coordinates: [10, 10], zoom: 1 });
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);

  const handleMoveEnd = useCallback((pos: MapPosition) => {
    setPosition(pos);
  }, []);

  const handleCountryClick = useCallback((geo: any) => {
    const name: string = geo.properties?.name ?? 'Unknown';
    // Calculate centroid of the clicked country geometry
    const centroid = geoCentroid(geo) as [number, number];
    if (!centroid || !isFinite(centroid[0]) || !isFinite(centroid[1])) return;

    setSelectedCountry(name);
    setPosition({ coordinates: centroid, zoom: 4 });
    setTooltip(null);
  }, []);

  const handleMouseEnter = useCallback((geo: any, evt: React.MouseEvent) => {
    const name: string = geo.properties?.name ?? 'Unknown';
    setHoveredCountry(name);
    setTooltip({ name, x: evt.clientX, y: evt.clientY });
  }, []);

  const handleMouseMove = useCallback((evt: React.MouseEvent) => {
    if (tooltip) {
      setTooltip(prev => prev ? { ...prev, x: evt.clientX, y: evt.clientY } : null);
    }
  }, [tooltip]);

  const handleMouseLeave = useCallback(() => {
    setHoveredCountry(null);
    setTooltip(null);
  }, []);

  const resetView = () => {
    setPosition({ coordinates: [10, 10], zoom: 1 });
    setSelectedCountry(null);
    setTooltip(null);
  };

  const zoomIn = () =>
    setPosition(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.5, 16) }));

  const zoomOut = () =>
    setPosition(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.5, 1) }));

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
            {selectedCountry
              ? 'Scroll to zoom · Drag to pan · Click to re-center'
              : subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedCountry && (
            <button
              onClick={resetView}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded transition-all"
              style={{
                color: accent,
                border: `1px solid ${accent}30`,
                background: `${accent}08`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}18`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}08`; }}
            >
              <ArrowLeft size={11} /> World
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
            <ZoomIn size={13} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>
      </div>

      {/* Map */}
      <div
        className="relative"
        style={{ background: '#020c18', height: 340 }}
        onMouseMove={handleMouseMove}
      >
        {/* Scan grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: `linear-gradient(${accent}05 1px, transparent 1px), linear-gradient(90deg, ${accent}05 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: 153 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            translateExtent={[[-100, -100], [900, 600]]}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const name: string = geo.properties?.name ?? '';
                  const isSelected = selectedCountry === name;
                  const isHovered = hoveredCountry === name;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleCountryClick(geo)}
                      onMouseEnter={evt => handleMouseEnter(geo, evt as unknown as React.MouseEvent)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: isSelected
                            ? `${accent}35`
                            : isHovered
                            ? `${accent}22`
                            : `${accent}0a`,
                          stroke: isSelected
                            ? accent
                            : isHovered
                            ? `${accent}60`
                            : `${accent}25`,
                          strokeWidth: isSelected ? 0.8 : isHovered ? 0.6 : 0.35,
                          outline: 'none',
                          cursor: 'pointer',
                          filter: isSelected
                            ? `drop-shadow(0 0 4px ${accent}60)`
                            : 'none',
                          transition: 'fill 0.15s, stroke 0.15s',
                        },
                        hover: {
                          fill: `${accent}22`,
                          stroke: `${accent}60`,
                          strokeWidth: 0.6,
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        pressed: {
                          fill: `${accent}40`,
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed pointer-events-none z-50"
            style={{
              left: tooltip.x + 12,
              top: tooltip.y - 10,
              background: 'rgba(2,4,8,0.92)',
              border: `1px solid ${accent}40`,
              borderRadius: 6,
              padding: '5px 10px',
              fontSize: 12,
              fontWeight: 600,
              color: accent,
              fontFamily: 'DM Sans, sans-serif',
              boxShadow: `0 4px 16px rgba(0,0,0,0.8), 0 0 8px ${accent}20`,
              whiteSpace: 'nowrap',
            }}
          >
            {tooltip.name}
          </div>
        )}
      </div>

      {/* Legend */}
      <div
        className="flex items-center justify-between px-5 py-2.5 shrink-0"
        style={{ borderTop: `1px solid ${accent}08` }}
      >
        <div className="flex items-center gap-4">
          {[
            { label: 'Hover', color: `${accent}60`, solid: false },
            { label: 'Selected', color: accent, solid: true },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  background: l.solid ? `${accent}35` : `${accent}12`,
                  border: `1px solid ${l.color}`,
                  boxShadow: l.solid ? `0 0 4px ${accent}40` : 'none',
                }}
              />
              <span style={{ color: 'rgba(224,247,255,0.4)', fontSize: 11 }}>{l.label}</span>
            </div>
          ))}
        </div>
        <span style={{ color: 'rgba(224,247,255,0.3)', fontSize: 11 }}>
          {position.zoom > 1.1
            ? `Zoom ${position.zoom.toFixed(1)}×`
            : 'Click a country to zoom in'}
        </span>
      </div>
    </div>
  );
}
