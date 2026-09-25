import React from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export function MapControls({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();
  const fit = () => {
    if (bounds) map.fitBounds(bounds, { padding: [50, 50] });
  };
  return (
    <div className="leaflet-top leaflet-right mt-[80px] mr-[10px]">
      <div className="leaflet-control leaflet-bar">
        <button onClick={fit} className="bg-white hover:bg-slate-50 w-8 h-8 flex items-center justify-center font-bold text-lg" title="Fit to bounds" style={{ cursor: 'pointer' }}>
          ?
        </button>
      </div>
    </div>
  );
}
