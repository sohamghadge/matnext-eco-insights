import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RVSFInfo, RCOriginState } from '@/data/competitorData';

interface OEMCompetitorMapProps {
  rvsfList: RVSFInfo[];
  rcOriginData: RCOriginState[];
  showRVSFPins: boolean;
  className?: string;
  rvsfCollectionTotals?: Record<string, number>;
  // When non-null, map zooms/pans to fit these bounds instead of showing all-India
  focusBounds: [[number, number], [number, number]] | null;
}

const IndiaCenter: [number, number] = [22.5, 82.0];
const IndiaBounds: [[number, number], [number, number]] = [[6.0, 67.0], [38.5, 98.5]];

// Dynamic map updater — zooms to focusBounds when provided, else resets to India overview
const MapUpdater = ({ bounds }: { bounds: [[number, number], [number, number]] | null }) => {
  const map = useMap();
  // Serialize to string so useEffect can compare without ref issues
  const boundsKey = bounds ? bounds.flat().join(',') : 'india';
  const prevKeyRef = useRef(boundsKey);

  useEffect(() => {
    if (boundsKey === prevKeyRef.current && prevKeyRef.current !== 'india') return;
    prevKeyRef.current = boundsKey;

    if (bounds) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8, animate: true, duration: 0.6 });
    } else {
      map.setView(IndiaCenter, 4.8, { animate: true });
    }
  }, [map, boundsKey, bounds]);

  return null;
};

// Color scale for RC origin choropleth (light → deep green/olive, matches theme)
const originColor = (count: number, maxCount: number): string => {
  if (maxCount === 0) return '#d1fae5';
  const ratio = count / maxCount;
  if (ratio > 0.75) return '#1a5c3a';
  if (ratio > 0.55) return '#2d7a52';
  if (ratio > 0.40) return '#4a9a6e';
  if (ratio > 0.25) return '#72b892';
  if (ratio > 0.15) return '#a0d4b4';
  if (ratio > 0.08) return '#c8ebd8';
  return '#e8f7f0';
};

const oemPinColor: Record<string, string> = {
  msil: '#003087', tata: '#00388B', mahindra: '#E31837', honda: '#CC0000', toyota: '#EB0A1E',
};

const makeRVSFIcon = (color: string, type: 'full_dismantling' | 'collection_touchpoint') => {
  const size = type === 'full_dismantling' ? 22 : 16;
  const border = type === 'collection_touchpoint' ? `border: 2px dashed ${color}` : 'border: 2.5px solid white';
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};${border};box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;">
      <div style="width:${size * 0.35}px;height:${size * 0.35}px;background:white;border-radius:50%;"></div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const OEMCompetitorMap: React.FC<OEMCompetitorMapProps> = ({
  rvsfList, rcOriginData, showRVSFPins, className = '', rvsfCollectionTotals = {}, focusBounds,
}) => {
  const maxCount = Math.max(...rcOriginData.map(d => d.count), 1);

  // Offset overlapping RVSF pins slightly
  const positionedRVSFs = rvsfList.map((rvsf, i) => {
    const samePos = rvsfList.slice(0, i).filter(o => Math.abs(o.lat - rvsf.lat) < 0.05 && Math.abs(o.lng - rvsf.lng) < 0.05);
    const angle = (samePos.length * 60 * Math.PI) / 180;
    const offset = samePos.length > 0 ? 0.06 : 0;
    return { ...rvsf, displayLat: rvsf.lat + offset * Math.sin(angle), displayLng: rvsf.lng + offset * Math.cos(angle) };
  });

  return (
    <div className={`relative ${className} h-[520px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200`}>
      <MapContainer
        center={IndiaCenter}
        zoom={4.8}
        zoomSnap={0.1}
        minZoom={4}
        maxZoom={9}
        maxBounds={IndiaBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater bounds={focusBounds} />

        {/* RC Origin state bubbles */}
        {rcOriginData.map(d => (
          <CircleMarker
            key={d.state}
            center={[d.lat, d.lng]}
            radius={10 + (d.count / maxCount) * 28}
            pathOptions={{ fillColor: originColor(d.count, maxCount), fillOpacity: 0.82, color: '#fff', weight: 1.5 }}
          >
            <Popup>
              <div className="p-1 min-w-[160px]">
                <div className="font-bold text-sm border-b pb-1 mb-2">{d.state}</div>
                <div className="text-xs text-gray-500">Vehicles collected (RC origin)</div>
                <div className="font-bold text-emerald-700 text-lg">{d.count.toLocaleString('en-IN')}</div>
                <div className="text-xs text-gray-400 mt-1">{Math.round((d.count / maxCount) * 100)}% of top-state volume</div>
                <div className="text-xs text-slate-400 mt-1 italic">Origin state from vehicle RC, not RVSF location.</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* RVSF location pins */}
        {showRVSFPins && positionedRVSFs.map(rvsf => {
          const color = rvsf.oems.length > 0 ? (oemPinColor[rvsf.oems[0]] || '#5a7a32') : '#5a7a32';
          const total = rvsfCollectionTotals[rvsf.id] || 0;
          return (
            <Marker key={rvsf.id} position={[rvsf.displayLat, rvsf.displayLng]} icon={makeRVSFIcon(color, rvsf.type)}>
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <div className="font-bold text-sm border-b pb-1 mb-2">{rvsf.name}</div>
                  <div className="text-xs text-gray-500">{rvsf.city}, {rvsf.state}</div>
                  <div className="mt-2 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type</span>
                      <span className={`font-medium ${rvsf.type === 'full_dismantling' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {rvsf.type === 'full_dismantling' ? 'Full Dismantling' : 'Collection Touchpoint'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Annual Capacity</span>
                      <span className="font-medium">{rvsf.capacityPerYear > 0 ? rvsf.capacityPerYear.toLocaleString('en-IN') : '—'}</span>
                    </div>
                    {total > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Collected (period)</span>
                        <span className="font-medium text-emerald-700">{total.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    {rvsf.operatingPartner && <div className="pt-1 text-gray-400 italic">{rvsf.operatingPartner}</div>}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 z-[1000] min-w-[180px]">
        <p className="font-bold text-xs text-slate-600 uppercase tracking-wider mb-2">RC Origin Density</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="flex gap-0.5">
            {['#e8f7f0', '#a0d4b4', '#4a9a6e', '#2d7a52', '#1a5c3a'].map(c => (
              <div key={c} style={{ background: c }} className="w-5 h-3 rounded-sm" />
            ))}
          </div>
          <span className="text-[10px] text-slate-500">Low → High</span>
        </div>
        <p className="text-[10px] text-slate-400 mb-2">Vehicles by RC registration state</p>
        {showRVSFPins && (
          <>
            <p className="font-bold text-xs text-slate-600 uppercase tracking-wider mb-1.5 pt-1 border-t border-slate-100">RVSF Pins</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px]">
                <div className="w-3.5 h-3.5 rounded-full bg-blue-800 border-2 border-white shadow flex-shrink-0" />
                <span className="text-slate-600">Full Dismantling Plant</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <div className="w-3 h-3 rounded-full border-2 border-dashed border-amber-600 flex-shrink-0" />
                <span className="text-slate-600">Collection Touchpoint</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="absolute top-3 right-3 bg-emerald-700/90 text-white text-xs px-3 py-1.5 rounded-lg shadow z-[1000] font-medium">
        Click bubble/pin for details
      </div>
    </div>
  );
};

export default OEMCompetitorMap;
