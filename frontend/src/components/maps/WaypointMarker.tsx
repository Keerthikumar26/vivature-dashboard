import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Phase4Data } from '@/types';

interface WaypointMarkerProps {
  data: Phase4Data;
}

const createNumberedIcon = (num: number, color: string = '#3b82f6') => {
  return L.divIcon({
    className: 'custom-waypoint-marker',
    html: `<div style="background-color: ${color}; color: white; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">${num}</div>`, 
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

export function WaypointMarker({ data }: WaypointMarkerProps) {
  const isTurn = data.path_type?.toLowerCase() === 'turn';
  const color = isTurn ? '#f97316' : '#3b82f6';
  const icon = createNumberedIcon(data.sequence, color);

  return (
    <Marker position={[data.lat, data.lon]} icon={icon}>
      <Popup>
        <div className="text-sm">
          <strong>Waypoint:</strong> #{data.sequence}<br/>
          <strong>Sequence:</strong> {data.sequence}<br/>
          <strong>Lat:</strong> {data.lat.toFixed(6)}<br/>
          <strong>Lon:</strong> {data.lon.toFixed(6)}<br/>
          <strong>Altitude:</strong> {data.alt?.toFixed(2) ?? 'N/A'} m<br/>
          <strong>Path Type:</strong> {data.path_type || 'Sweep'}
        </div>
      </Popup>
    </Marker>
  );
}
