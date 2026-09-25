import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Phase2Data } from '@/types'

const getMarkerColor = (health: string, severity: string) => {
  const h = (health || '').toLowerCase()
  const s = (severity || '').toLowerCase()
  if (h.includes('healthy')) return '#22c55e' // green
  if (s.includes('moderate')) return '#f97316' // orange
  if (s.includes('severe')) return '#ef4444' // red
  return '#3b82f6' // default blue
}

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-gps-marker',
    html: <div style="background-color:  + color + ; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 2px rgba(0,0,0,0.5);"></div>,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6]
  })
}

interface GPSMarkerProps {
  data: Phase2Data;
}

export function GPSMarker({ data }: GPSMarkerProps) {
  const color = getMarkerColor(data.health_classification, data.severity_level)
  const icon = createCustomIcon(color)
  
  // Handle naming variations dynamically
  const ndvi = data.ndvi ?? data.avg_ndvi
  const ndre = data.ndre ?? data.avg_ndre

  return (
    <Marker position={[data.lat, data.lon]} icon={icon}>
      <Popup>
        <div className="text-sm">
          <strong>Grid ID:</strong> {data.grid_id}<br/>
          <strong>Lat:</strong> {data.lat.toFixed(6)}<br/>
          <strong>Lon:</strong> {data.lon.toFixed(6)}<br/>
          <strong>NDVI:</strong> {typeof ndvi === 'number' ? ndvi.toFixed(3) : 'N/A'}<br/>
          <strong>NDRE:</strong> {typeof ndre === 'number' ? ndre.toFixed(3) : 'N/A'}<br/>
          <strong>Veg Ratio:</strong> {typeof data.vegetation_ratio === 'number' ? data.vegetation_ratio.toFixed(3) : 'N/A'}<br/>
          <strong>Severity:</strong> {data.severity_level}<br/>
          <strong>Health:</strong> {data.health_classification}
        </div>
      </Popup>
    </Marker>
  )
}
