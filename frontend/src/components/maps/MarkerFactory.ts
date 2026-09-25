import L from 'leaflet';

export const getHealthColor = (severity: string, health: string = '') => {
  const h = String(health || '').toLowerCase();
  const s = String(severity || '').toLowerCase();
  if (h.includes('healthy') || s.includes('low')) return '#22c55e';
  if (s.includes('moderate')) return '#f97316';
  if (s.includes('high') || s.includes('severe')) return '#ef4444';
  return '#3b82f6';
};

export const createDivIcon = (color: string, size: number = 12) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 2px rgba(0,0,0,0.5);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2]
  });
};