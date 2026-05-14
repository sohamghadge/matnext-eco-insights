import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { StateHotspotData, ELVRVSFRegistry } from '@/data/dashboardData';

interface ELVHotspotMapProps {
  className?: string;
  viewMode: 'sales' | 'rvsf' | 'hotspot';
  hotspotData: StateHotspotData[];
  selectedFY: string;
  lagYears: number;
  lagFY: string;
  onStateClick: (state: string) => void;
  selectedState: string | null;
  rvsfRegistry?: ELVRVSFRegistry[];
}

const IndiaCenter: [number, number] = [22.5, 82.0];
const IndiaBounds: [[number, number], [number, number]] = [[6.0, 67.0], [38.5, 98.5]];

const MapUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom); }, [center, zoom, map]);
  return null;
};

const hotspotColor = (score: number): string => {
  if (score <= 33) return '#16a34a';
  if (score <= 66) return '#d97706';
  return '#dc2626';
};

const salesColor = (units: number, max: number): string => {
  const ratio = max > 0 ? units / max : 0;
  if (ratio > 0.7) return '#1d4ed8';
  if (ratio > 0.4) return '#3b82f6';
  if (ratio > 0.2) return '#60a5fa';
  return '#93c5fd';
};

const rvsfCoverageColor = (status: 'green' | 'amber' | 'red'): string => {
  if (status === 'green') return '#16a34a';
  if (status === 'amber') return '#d97706';
  return '#dc2626';
};

const ELVHotspotMap: React.FC<ELVHotspotMapProps> = ({
  className = '',
  viewMode,
  hotspotData,
  selectedFY,
  lagYears,
  lagFY,
  onStateClick,
  selectedState,
  rvsfRegistry = [],
}) => {
  const [mapCenter] = useState<[number, number]>(IndiaCenter);

  const maxSales = Math.max(...hotspotData.map(d => d.salesCurrentYear), 1);
  const maxRVSF = Math.max(...hotspotData.map(d => d.rvsfCount), 1);

  const getRadius = (d: StateHotspotData): number => {
    if (viewMode === 'sales') {
      return 10 + (d.salesCurrentYear / maxSales) * 30;
    }
    if (viewMode === 'rvsf') {
      return d.rvsfCount > 0 ? 10 + (d.rvsfCount / maxRVSF) * 28 : 6;
    }
    // hotspot
    return 12 + (d.hotspotScore / 100) * 28;
  };

  const getColor = (d: StateHotspotData): string => {
    if (viewMode === 'sales') return salesColor(d.salesCurrentYear, maxSales);
    if (viewMode === 'rvsf') return rvsfCoverageColor(d.coverageStatus);
    return hotspotColor(d.hotspotScore);
  };

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
        <MapUpdater center={mapCenter} zoom={4.8} />

        {/* Individual RVSF dots — density layer (rvsf view only) */}
        {viewMode === 'rvsf' && rvsfRegistry.filter(r => r.lat && r.lng).map(r => (
          <CircleMarker
            key={r.rvsfId}
            center={[r.lat!, r.lng!]}
            radius={3.5}
            pathOptions={{
              fillColor: r.status === 'active' ? '#22c55e' : '#94a3b8',
              fillOpacity: 0.8,
              color: '#fff',
              weight: 0.8,
            }}
          >
            <Popup>
              <div className="p-1 min-w-[160px]">
                <div className="font-bold text-sm border-b pb-1 mb-1.5">{r.name}</div>
                <div className="text-xs text-gray-600">{r.district}, {r.state}</div>
                {r.pincode && <div className="text-xs text-gray-500">PIN {r.pincode}</div>}
                <div className="text-xs mt-1.5 space-y-0.5">
                  <div><span className="text-gray-500">Capacity: </span><span className="font-semibold">{r.capacityPerYear.toLocaleString('en-IN')}/yr</span></div>
                  <div><span className="text-gray-500">Status: </span><span className={r.status === 'active' ? 'text-green-600 font-semibold' : 'text-slate-500'}>{r.status}</span></div>
                  <div><span className="text-gray-500">Types: </span><span>{r.vehicleTypes.join(', ')}</span></div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* State-level bubbles */}
        {hotspotData.map(d => (
          <CircleMarker
            key={d.state}
            center={[d.lat, d.lng]}
            radius={getRadius(d)}
            pathOptions={{
              fillColor: getColor(d),
              fillOpacity: selectedState === d.state ? 0.95 : 0.75,
              color: selectedState === d.state ? '#1e1b4b' : '#fff',
              weight: selectedState === d.state ? 3 : 1.5,
            }}
            eventHandlers={{ click: () => onStateClick(d.state) }}
          >
            <Popup>
              <div className="p-1 min-w-[180px]">
                <div className="font-bold text-base border-b pb-1 mb-2">{d.state}</div>
                {viewMode === 'sales' && (
                  <>
                    <div className="text-sm text-gray-600">Current Year Sales (FY {selectedFY})</div>
                    <div className="font-semibold text-blue-700 text-lg">{d.salesCurrentYear.toLocaleString('en-IN')} vehicles</div>
                  </>
                )}
                {viewMode === 'rvsf' && (
                  <>
                    <div className="text-sm text-gray-600">Active RVSFs</div>
                    <div className="font-semibold text-green-700 text-lg">{d.rvsfCount}</div>
                    <div className="text-sm text-gray-600 mt-1">Total Capacity/yr</div>
                    <div className="font-semibold">{d.totalCapacity.toLocaleString('en-IN')}</div>
                    <div className="text-sm text-gray-600 mt-1">Coverage Status</div>
                    <div className={`font-semibold ${d.coverageStatus === 'green' ? 'text-green-600' : d.coverageStatus === 'amber' ? 'text-amber-600' : 'text-red-600'}`}>
                      {d.coverageStatus === 'green' ? 'Adequate' : d.coverageStatus === 'amber' ? 'Partial' : 'Sparse'}
                    </div>
                  </>
                )}
                {viewMode === 'hotspot' && (
                  <>
                    <div className="text-sm text-gray-600">Vehicles sold {lagYears}yr ago (FY {lagFY})</div>
                    <div className="font-semibold text-orange-700">{d.salesLagYear.toLocaleString('en-IN')}</div>
                    <div className="text-sm text-gray-600 mt-1">Collected (FY {selectedFY})</div>
                    <div className="font-semibold text-green-700">{d.vehiclesCollected.toLocaleString('en-IN')}</div>
                    <div className="text-sm text-gray-600 mt-1">Gap</div>
                    <div className="font-semibold text-red-600">{Math.max(0, d.salesLagYear - d.vehiclesCollected).toLocaleString('en-IN')}</div>
                    <div className="mt-2 pt-1 border-t">
                      <span className="text-xs font-bold">Hotspot Score: </span>
                      <span className={`text-sm font-bold ${d.hotspotScore > 66 ? 'text-red-600' : d.hotspotScore > 33 ? 'text-amber-600' : 'text-green-600'}`}>
                        {d.hotspotScore}/100
                      </span>
                    </div>
                  </>
                )}
                <div className="text-xs text-blue-500 mt-2 cursor-pointer font-medium">Click for full analysis →</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-slate-200 z-[1000] min-w-[160px]">
        <p className="font-bold text-xs text-slate-600 uppercase tracking-wider mb-2">
          {viewMode === 'sales' ? 'Sales Volume' : viewMode === 'rvsf' ? 'RVSF Coverage' : 'Hotspot Severity'}
        </p>
        <div className="space-y-1.5">
          {viewMode === 'hotspot' && (
            <>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-red-600 shadow-sm flex-shrink-0"></span>
                <span className="text-slate-600">Critical (67–100)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm flex-shrink-0"></span>
                <span className="text-slate-600">Moderate (34–66)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-green-600 shadow-sm flex-shrink-0"></span>
                <span className="text-slate-600">Managed (0–33)</span>
              </div>
            </>
          )}
          {viewMode === 'sales' && (
            <>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-blue-800 shadow-sm flex-shrink-0"></span>
                <span className="text-slate-600">High Volume</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-blue-400 shadow-sm flex-shrink-0"></span>
                <span className="text-slate-600">Low Volume</span>
              </div>
              <div className="flex items-center gap-1 text-xs mt-1 text-slate-500">
                <span>Bubble size ∝ sales</span>
              </div>
            </>
          )}
          {viewMode === 'rvsf' && (
            <>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-green-600 shadow-sm flex-shrink-0"></span>
                <span className="text-slate-600">Adequate (state)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm flex-shrink-0"></span>
                <span className="text-slate-600">Partial (state)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-red-600 shadow-sm flex-shrink-0"></span>
                <span className="text-slate-600">Sparse (state)</span>
              </div>
              <div className="border-t border-slate-200 mt-1.5 pt-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-white shadow-sm flex-shrink-0"></span>
                  <span className="text-slate-600">Active RVSF</span>
                </div>
                <div className="flex items-center gap-2 text-xs mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 border border-white shadow-sm flex-shrink-0"></span>
                  <span className="text-slate-600">Inactive RVSF</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Click hint */}
      <div className="absolute top-3 right-3 bg-indigo-600/90 text-white text-xs px-3 py-1.5 rounded-lg shadow z-[1000] font-medium">
        Click state bubble for details
      </div>
    </div>
  );
};

export default ELVHotspotMap;
