import { Polyline } from 'react-leaflet';
import { Phase6Data } from '@/types';

interface MissionPolylineProps {
  data: Phase6Data[];
}

export function MissionPolyline({ data }: MissionPolylineProps) {
  const sorted = [...data].sort((a, b) => a.waypoint - b.waypoint);
  const positions: [number, number][] = sorted
    .filter(d => typeof d.lat === 'number' && typeof d.lon === 'number' && !isNaN(d.lat) && !isNaN(d.lon) && d.lat !== 0 && d.lon !== 0)
    .map(d => [d.lat, d.lon]);

  if (positions.length < 2) return null;

  return (
    <Polyline 
      positions={positions} 
      pathOptions={{ color: '#1e40af', weight: 4, opacity: 0.9 }} 
    />
  );
}
