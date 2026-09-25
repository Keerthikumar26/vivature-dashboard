import { CircleMarker, Popup } from 'react-leaflet'
import { Phase3Data } from '@/types'

const getZoneColor = (severity: string) => {
  const s = (severity || '').toLowerCase()
  if (s.includes('low')) return '#22c55e' // green
  if (s.includes('moderate')) return '#f97316' // orange
  if (s.includes('high') || s.includes('severe')) return '#ef4444' // red
  return '#3b82f6' // blue default
}

interface ZoneMarkerProps {
  data: Phase3Data;
}

export function ZoneMarker({ data }: ZoneMarkerProps) {
  const color = getZoneColor(data.severity)
  
  // Radius proportional to area, with a minimum size so it's clickable
  const radius = Math.max(8, Math.sqrt(data.area || 0) * 2)

  // Handle potential naming variations
  const lat = data.center_lat ?? data.lat ?? 0
  const lon = data.center_lon ?? data.lon ?? 0
  const ndvi = data.avg_ndvi ?? data.ndvi

  if (lat === 0 && lon === 0) return null; // Skip invalid coordinates

  return (
    <CircleMarker 
      center={[lat, lon]} 
      radius={radius}
      pathOptions={{ fillColor: color, color: color, weight: 2, fillOpacity: 0.6 }}
    >
      <Popup>
        <div className="text-sm">
          <strong>Zone ID:</strong> {data.zone_id}<br/>
          <strong>Grid Count:</strong> {data.grid_count}<br/>
          <strong>Avg NDVI:</strong> {typeof ndvi === 'number' ? ndvi.toFixed(3) : 'N/A'}<br/>
          <strong>Severity:</strong> {data.severity}<br/>
          <strong>Area:</strong> {data.area?.toFixed(2) ?? 'N/A'} m²<br/>
          <strong>Center Lat:</strong> {lat.toFixed(6)}<br/>
          <strong>Center Lon:</strong> {lon.toFixed(6)}
        </div>
      </Popup>
    </CircleMarker>
  )
}
