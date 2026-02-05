import React from 'react';
import { Tooltip } from 'antd';
import { vehicleOriginLocations } from '@/data/dashboardData';

interface IndiaMapProps {
    className?: string;
    viewMode?: 'origin' | 'collection' | 'rvsf';
    rvsfFilter?: string;
}

// City/State coordinates mapped to the image coordinates (percentage-based)
const locationCoordinates: { [key: string]: { x: number; y: number } } = {
    'Maharashtra': { x: 24, y: 56 },      // Mumbai/Maharashtra region
    'Delhi NCR': { x: 32, y: 28 },         // New Delhi region
    'Gujarat': { x: 18, y: 44 },           // Gujarat region
    'Tamil Nadu': { x: 35, y: 78 },        // Chennai/Tamil Nadu region
    'Karnataka': { x: 28, y: 70 },         // Bengaluru/Karnataka region
    'Rajasthan': { x: 24, y: 34 },         // Rajasthan region
    'Uttar Pradesh': { x: 40, y: 34 },     // Uttar Pradesh region
    'Madhya Pradesh': { x: 34, y: 48 },    // Madhya Pradesh region
    'West Bengal': { x: 55, y: 44 },       // Kolkata/West Bengal region
    'Punjab': { x: 28, y: 22 },            // Punjab region
    'Haryana': { x: 30, y: 26 },           // Haryana region
    'Kerala': { x: 30, y: 84 },            // Kerala region
    'Telangana': { x: 33, y: 60 },         // Hyderabad/Telangana region
    'Andhra Pradesh': { x: 38, y: 66 },    // Andhra Pradesh region
    'Odisha': { x: 50, y: 54 },            // Odisha region
    // Additional granular locations for RVSF/Collection Centers
    'Noida': { x: 33, y: 29 },
    'Manesar': { x: 31, y: 29 },
    'Pune': { x: 24, y: 58 },
    'Chennai': { x: 36, y: 77 },
    'Kolkata': { x: 55, y: 45 },
    'Bangalore': { x: 29, y: 71 },
};

// Mock data for Collection Centers
const collectionCenters = [
    { id: 'CC1', location: 'Manesar', state: 'Haryana', type: 'Collection Center' },
    { id: 'CC2', location: 'Pune', state: 'Maharashtra', type: 'Collection Center' },
    { id: 'CC3', location: 'Chennai', state: 'Tamil Nadu', type: 'Collection Center' },
    { id: 'CC4', location: 'Kolkata', state: 'West Bengal', type: 'Collection Center' },
    { id: 'CC5', location: 'Bangalore', state: 'Karnataka', type: 'Collection Center' },
];

// Mock data for RVSFs
const rvsfLocations = [
    { id: 'RVSF1', name: 'MSTI Noida', location: 'Noida', state: 'Uttar Pradesh', capacity: '1000/month' },
    { id: 'RVSF2', name: 'MSTI Gujarat', location: 'Gujarat', state: 'Gujarat', capacity: '800/month' },
    { id: 'RVSF3', name: 'MSTI South', location: 'Karnataka', state: 'Karnataka', capacity: '600/month' },
    { id: 'RVSF4', name: 'MSTI West', location: 'Maharashtra', state: 'Maharashtra', capacity: '750/month' },
];

const IndiaMap: React.FC<IndiaMapProps> = ({ className = '', viewMode = 'origin', rvsfFilter }) => {

    const getDensityColor = (density: number) => {
        if (density >= 9) return '#ef4444';   // Red - High
        if (density >= 7) return '#f97316';   // Orange - Med-High
        if (density >= 5) return '#eab308';   // Yellow - Medium
        if (density >= 3) return '#22c55e';   // Green - Low
        return '#3b82f6';                      // Blue - Very Low
    };

    const getDotSize = (density: number) => {
        return 8 + (density * 2);
    };

    const getOpacity = (density: number) => {
        return 0.6 + (density * 0.04);
    };

    // Filter RVSF locations based on dropdown selection
    const filteredRvsfLocations = rvsfFilter && rvsfFilter !== 'All'
        ? rvsfLocations.filter(rvsf => rvsf.name === rvsfFilter)
        : rvsfLocations;

    return (
        <div className={`relative ${className}`}>
            {/* Map Container */}
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200">
                {/* Base Map Image */}
                <img
                    src="/india-map.png"
                    alt="India Map"
                    className="w-full h-auto"
                    style={{ minHeight: '400px', objectFit: 'cover' }}
                />

                {/* Overlay Container */}
                <div className="absolute inset-0 w-full h-full">

                    {/* Mode: Vehicle Origin (RC Data) */}
                    {viewMode === 'origin' && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                            <defs>
                                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            {vehicleOriginLocations.map((location) => {
                                const coords = locationCoordinates[location.state];
                                if (!coords) return null;
                                const color = getDensityColor(location.density);
                                const size = getDotSize(location.density);
                                const opacity = getOpacity(location.density);

                                return (
                                    <g key={location.state}>
                                        <circle cx={`${coords.x}%`} cy={`${coords.y}%`} r={size + 6} fill="none" stroke={color} strokeWidth="2" opacity="0.3" className="animate-ping" style={{ animationDuration: '3s', transformOrigin: `${coords.x}% ${coords.y}%` }} />
                                        <circle cx={`${coords.x}%`} cy={`${coords.y}%`} r={size + 3} fill={color} opacity="0.2" filter="url(#glow)" />
                                        <circle cx={`${coords.x}%`} cy={`${coords.y}%`} r={size} fill={color} stroke="white" strokeWidth="2" opacity={opacity} filter="url(#glow)" className="pointer-events-auto cursor-pointer" style={{ transformOrigin: `${coords.x}% ${coords.y}%` }} />
                                    </g>
                                );
                            })}
                        </svg>
                    )}
                    {viewMode === 'origin' && vehicleOriginLocations.map(location => {
                        const coords = locationCoordinates[location.state];
                        if (!coords) return null;
                        const size = getDotSize(location.density);
                        const color = getDensityColor(location.density);
                        return (
                            <Tooltip
                                key={location.state}
                                title={
                                    <div className="p-1">
                                        <div className="font-bold text-white">{location.state}</div>
                                        <div className="text-gray-200 text-sm">RC Data: <span className="font-semibold text-white">{location.vehicleCount.toLocaleString()}</span></div>
                                        <div className="text-gray-200 text-sm">Density: <span className="font-semibold text-white">{location.density}/10</span></div>
                                    </div>
                                }
                                color={color}
                            >
                                <div className="absolute rounded-full cursor-pointer" style={{ left: `${coords.x}%`, top: `${coords.y}%`, width: `${size * 2 + 12}px`, height: `${size * 2 + 12}px`, transform: 'translate(-50%, -50%)' }} />
                            </Tooltip>
                        );
                    })}


                    {/* Mode: Collection Centers */}
                    {viewMode === 'collection' && collectionCenters.map((cc) => {
                        const coords = locationCoordinates[cc.location] || locationCoordinates[cc.state];
                        if (!coords) return null;

                        return (
                            <Tooltip
                                key={cc.id}
                                title={
                                    <div className="p-1">
                                        <div className="font-bold text-white">{cc.type}</div>
                                        <div>{cc.location}, {cc.state}</div>
                                    </div>
                                }
                                color="blue"
                            >
                                <div
                                    className="absolute w-4 h-4 bg-blue-600 border-2 border-white rounded-sm transform rotate-45 cursor-pointer hover:scale-125 transition-transform shadow-lg"
                                    style={{
                                        left: `${coords.x}%`,
                                        top: `${coords.y}%`,
                                        transform: 'translate(-50%, -50%) rotate(45deg)',
                                    }}
                                />
                            </Tooltip>
                        );
                    })}

                    {/* Mode: RVSF Locations */}
                    {viewMode === 'rvsf' && filteredRvsfLocations.map((rvsf) => {
                        const coords = locationCoordinates[rvsf.location] || locationCoordinates[rvsf.state];
                        if (!coords) return null;

                        return (
                            <Tooltip
                                key={rvsf.id}
                                title={
                                    <div className="p-1">
                                        <div className="font-bold text-white">{rvsf.name}</div>
                                        <div>{rvsf.location}, {rvsf.state}</div>
                                        <div className="text-xs text-green-200">Capacity: {rvsf.capacity}</div>
                                    </div>
                                }
                                color="green"
                            >
                                <div
                                    className="absolute cursor-pointer hover:scale-125 transition-transform"
                                    style={{
                                        left: `${coords.x}%`,
                                        top: `${coords.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    <div className="w-6 h-6 bg-green-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                                        <span className="text-[10px] text-white font-bold">R</span>
                                    </div>
                                </div>
                            </Tooltip>
                        );
                    })}
                </div>

                {/* Legend - Dynamic based on viewMode */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
                    <p className="font-bold text-sm mb-2 text-gray-700">
                        {viewMode === 'origin' ? 'RC Data Density' : viewMode === 'collection' ? 'Facilities' : 'RVSF Units'}
                    </p>
                    <div className="space-y-1.5">
                        {viewMode === 'origin' && (
                            <>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                    <span className="text-gray-600">High Density</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    <span className="text-gray-600">Low Density</span>
                                </div>
                            </>
                        )}
                        {viewMode === 'collection' && (
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-3 h-3 bg-blue-600 rotate-45"></span>
                                <span className="text-gray-600">Collection Center</span>
                            </div>
                        )}
                        {viewMode === 'rvsf' && (
                            <div className="flex items-center gap-2 text-xs">
                                <span className="w-3 h-3 rounded-full bg-green-600 border border-white flex items-center justify-center text-[8px] text-white">R</span>
                                <span className="text-gray-600">RVSF Unit</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndiaMap;
