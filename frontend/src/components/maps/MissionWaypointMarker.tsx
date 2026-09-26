import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Phase6Data } from '@/types';

interface MissionWaypointMarkerProps {
  data: Phase6Data;
  isTakeoff: boolean;
  isLanding: boolean;
}

const createNumberedIcon = (num: number, color: string = '#3b82f6') => {
  return L.divIcon({
    className: 'custom-mission-marker',
    html: `<div style="background-color: ${color}; color: white; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold;">${num}</div>`, 
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

export function MissionWaypointMarker({ data, isTakeoff, isLanding }: MissionWaypointMarkerProps) {
  let color = '#3b82f6'; // Intermediate (Blue)
  if (isTakeoff) color = '#22c55e'; // Takeoff (Green)
  else if (isLanding) color = '#ef4444'; // Landing (Red)

  const icon = createNumberedIcon(data.waypoint, color);

  return (
    <Marker position={[data.lat, data.lon]} icon={icon}>
      <Popup>
        <div className="text-sm">
          <strong>Waypoint:</strong> #{data.waypoint}<br/>
          <strong>Lat:</strong> {data.lat.toFixed(6)}<br/>
          <strong>Lon:</strong> {data.lon.toFixed(6)}<br/>
          <strong>Alt:</strong> {data.alt?.toFixed(2) ?? 'N/A'} m<br/>
          <strong>Command:</strong> {data.command}<br/>
          <strong>Frame:</strong> {data.frame}
        </div>
      </Popup>
    </Marker>
  );
}
