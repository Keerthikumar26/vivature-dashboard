export const calculateCenter = (data: any[], latKey: string = 'lat', lonKey: string = 'lon') => {
  const valid = data.filter(d => typeof d[latKey] === 'number' && typeof d[lonKey] === 'number' && !isNaN(d[latKey]) && !isNaN(d[lonKey]));
  if (valid.length === 0) return { lat: 0, lon: 0, validPoints: [] };
  const lat = valid.reduce((sum, d) => sum + d[latKey], 0) / valid.length;
  const lon = valid.reduce((sum, d) => sum + d[lonKey], 0) / valid.length;
  return { lat, lon, validPoints: valid };
}

export const calculateBounds = (validPoints: any[], latKey: string = 'lat', lonKey: string = 'lon') => {
  if (validPoints.length === 0) return null;
  const lats = validPoints.map(d => d[latKey]);
  const lons = validPoints.map(d => d[lonKey]);
  return [
    [Math.min(...lats), Math.min(...lons)],
    [Math.max(...lats), Math.max(...lons)]
  ];
}

// Haversine distance in meters
export const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371e3; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const calculateTotalDistance = (points: any[], latKey: string = 'lat', lonKey: string = 'lon') => {
  let distance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    distance += haversineDistance(points[i][latKey], points[i][lonKey], points[i+1][latKey], points[i+1][lonKey]);
  }
  return distance;
}
