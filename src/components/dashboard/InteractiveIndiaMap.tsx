import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    rvsfLocations,
    collectionCenters,
    vehicleOriginLocations,
    VehicleOriginLocation,
    FilterState,
    defaultFilters,
    getCollectionCenterVehicles,
    getRVSFVehicles
} from '@/data/dashboardData';

// Fix for default marker icon in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveIndiaMapProps {
    className?: string;
    viewMode?: 'origin' | 'collection' | 'rvsf';
    rvsfFilter?: string;
    collectionCenterFilter?: string;
    vehicleOriginLocationsData?: VehicleOriginLocation[];
    filters?: FilterState;
}

// Component to handle map center and zoom updates based on data
const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

// Custom Icons
const createCustomIcon = (color: string, size: number = 20, isSquare: boolean = false) => {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
            background-color: ${color};
            width: ${size}px;
            height: ${size}px;
            border-radius: ${isSquare ? '2px' : '50%'};
            border: 2px solid white;
            box-shadow: 0 0 4px rgba(0,0,0,0.4);
            opacity: 0.8;
            ${isSquare ? 'transform: rotate(45deg);' : ''}
        "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
    });
};

const IndiaCenter: [number, number] = [20.5937, 78.9629];
const DefaultZoom = 5;

const InteractiveIndiaMap: React.FC<InteractiveIndiaMapProps> = ({
    className = '',
    viewMode = 'origin',
    rvsfFilter,
    collectionCenterFilter,
    vehicleOriginLocationsData,
    filters = defaultFilters
}) => {
    const [mapCenter, setMapCenter] = useState<[number, number]>(IndiaCenter);
    const [mapZoom, setMapZoom] = useState<number>(DefaultZoom);

    // Use passed data or fallback to imported static data
    const activeVehicleOriginLocations = vehicleOriginLocationsData || vehicleOriginLocations;

    // Filter Logic
    const filteredRvsfLocations = rvsfFilter && rvsfFilter !== 'All'
        ? rvsfLocations.filter(rvsf => rvsf.name === rvsfFilter)
        : rvsfLocations;

    const filteredCollectionCenters = collectionCenterFilter && collectionCenterFilter !== 'All'
        ? collectionCenters.filter(cc => cc.location === collectionCenterFilter)
        : collectionCenters;

    // Determine Map Center based on selection
    useEffect(() => {
        if (viewMode === 'rvsf' && rvsfFilter && rvsfFilter !== 'All' && filteredRvsfLocations.length > 0) {
            const rvsf = filteredRvsfLocations[0];
            if (rvsf.lat && rvsf.lng) {
                setMapCenter([rvsf.lat, rvsf.lng]);
                setMapZoom(10);
                return;
            }
        }

        if (viewMode === 'collection' && collectionCenterFilter && collectionCenterFilter !== 'All' && filteredCollectionCenters.length > 0) {
            const cc = filteredCollectionCenters[0];
            if (cc.lat && cc.lng) {
                setMapCenter([cc.lat, cc.lng]);
                setMapZoom(10);
                return;
            }
        }

        // Reset to default if 'All' is selected or switching modes
        if (rvsfFilter === 'All' && collectionCenterFilter === 'All') {
            setMapCenter(IndiaCenter);
            setMapZoom(5);
        }
    }, [viewMode, rvsfFilter, collectionCenterFilter, filteredRvsfLocations, filteredCollectionCenters]);


    const getDensityColor = (density: number) => {
        if (density >= 9) return '#ef4444';   // Red - High
        if (density >= 7) return '#f97316';   // Orange - Med-High
        if (density >= 5) return '#eab308';   // Yellow - Medium
        if (density >= 3) return '#22c55e';   // Green - Low
        return '#3b82f6';                      // Blue - Very Low
    };

    const getDotSize = (density: number) => {
        return 12 + (density * 2);
    };

    return (
        <div className={`relative ${className} h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200`}>
            <MapContainer
                center={IndiaCenter}
                zoom={DefaultZoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <ZoomControl position="bottomright" />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapUpdater center={mapCenter} zoom={mapZoom} />

                {/* Mode: Vehicle Origin (RC Data) */}
                {viewMode === 'origin' && activeVehicleOriginLocations.map((location: VehicleOriginLocation) => (
                    <Marker
                        key={location.state}
                        position={[location.lat, location.lng]}
                        icon={createCustomIcon(getDensityColor(location.density), getDotSize(location.density))}
                    >
                        <Popup>
                            <div className="p-1">
                                <div className="font-bold text-base">{location.state}</div>
                                <div className="text-gray-600 text-sm">
                                    RC Data Count: <span className="font-semibold text-gray-800">{location.vehicleCount.toLocaleString()}</span>
                                </div>
                                <div className="text-gray-600 text-sm">
                                    Density: <span className="font-semibold text-gray-800">{location.density}/10</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Mode: Collection Centers */}
                {viewMode === 'collection' && filteredCollectionCenters.map((cc) => (
                    (cc.lat && cc.lng) ? (
                        <Marker
                            key={cc.id}
                            position={[cc.lat, cc.lng]}
                            icon={createCustomIcon('#2563eb', 16, true)} // Blue Diamond
                        >
                            <Popup>
                                <div className="p-1">
                                    <div className="font-bold text-base text-blue-800">{cc.type}</div>
                                    <div className="font-semibold">{cc.location}, {cc.state}</div>
                                    <div className="text-gray-600 text-sm mt-1">
                                        Vehicles Collected: <span className="font-semibold text-gray-800">{getCollectionCenterVehicles(cc, filters).toLocaleString()}</span>
                                    </div>
                                    <div className="text-gray-500 text-xs mt-1">ID: {cc.id}</div>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null
                ))}

                {/* Mode: RVSF Locations */}
                {viewMode === 'rvsf' && filteredRvsfLocations.map((rvsf) => (
                    (rvsf.lat && rvsf.lng) ? (
                        <Marker
                            key={rvsf.id}
                            position={[rvsf.lat, rvsf.lng]}
                            icon={createCustomIcon('#16a34a', 24)} // Green Circle
                        >
                            <Popup>
                                <div className="p-1">
                                    <div className="font-bold text-base text-green-800">{rvsf.name}</div>
                                    <div className="font-semibold">{rvsf.location}, {rvsf.state}</div>
                                    <div className="text-sm text-green-700 mt-1">
                                        Vehicles Collected: <span className="font-semibold text-gray-800">{getRVSFVehicles(rvsf, filters).toLocaleString()}</span>
                                    </div>
                                    <div className="text-gray-500 text-xs mt-1">Capacity: {rvsf.capacity}</div>
                                    <div className="text-gray-500 text-xs">ID: {rvsf.id}</div>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MapContainer>

            {/* Legend Overlay */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 z-[1000]">
                <p className="font-bold text-sm mb-2 text-gray-700">
                    {viewMode === 'origin' ? 'RC Data Density' : viewMode === 'collection' ? 'Facilities' : 'RVSF Units'}
                </p>
                <div className="space-y-1.5">
                    {viewMode === 'origin' && (
                        <>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm"></span>
                                <span className="text-gray-600">High Density</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-3 h-3 rounded-full bg-green-500 border border-white shadow-sm"></span>
                                <span className="text-gray-600">Low Density</span>
                            </div>
                        </>
                    )}
                    {viewMode === 'collection' && (
                        <div className="flex items-center gap-2 text-xs">
                            <div className="w-3 h-3 bg-blue-600 transform rotate-45 border border-white shadow-sm"></div>
                            <span className="text-gray-600 ml-1">Collection Center</span>
                        </div>
                    )}
                    {viewMode === 'rvsf' && (
                        <div className="flex items-center gap-2 text-xs">
                            <span className="w-3 h-3 rounded-full bg-green-600 border border-white shadow-sm"></span>
                            <span className="text-gray-600">RVSF Unit</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InteractiveIndiaMap;
