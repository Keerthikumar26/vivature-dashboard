import { Polyline } from 'react-leaflet';
import { Phase4Data } from '@/types';

interface CoveragePathProps {
  data: Phase4Data[];
}

export function CoveragePath({ data }: CoveragePathProps) {
  const sorted = [...data].sort((a, b) => a.sequence - b.sequence);
  const positions: [number, number][] = sorted
    .filter(d => typeof d.lat === 'number' && typeof d.lon === 'number')
    .map(d => [d.lat, d.lon]);

  if (positions.length < 2) return null;

  return (
    <Polyline 
      positions={positions} 
      pathOptions={{ color: '#3b82f6', weight: 3, dashArray: '5, 10', opacity: 0.8 }} 
    />
  );
}
