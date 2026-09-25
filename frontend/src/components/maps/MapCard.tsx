import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Phase2Data } from '@/types'
import { GPSMarker } from './GPSMarker'
import { MapLegend } from './MapLegend'

interface MapCardProps {
  data: Phase2Data[];
}

function BoundsFitter({ data }: { data: Phase2Data[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (data.length > 0) {
      const validPoints = data.filter(d => typeof d.lat === 'number' && typeof d.lon === 'number' && !isNaN(d.lat) && !isNaN(d.lon))
      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints.map(d => [d.lat, d.lon]))
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [data, map])
  
  return null
}

export function MapCard({ data }: MapCardProps) {
  const validPoints = data.filter(d => typeof d.lat === 'number' && typeof d.lon === 'number' && !isNaN(d.lat) && !isNaN(d.lon))
  const centerLat = validPoints.length > 0 ? validPoints.reduce((sum, d) => sum + d.lat, 0) / validPoints.length : 0;
  const centerLon = validPoints.length > 0 ? validPoints.reduce((sum, d) => sum + d.lon, 0) / validPoints.length : 0;

  if (validPoints.length === 0) {
    return (
      <Card className="flex flex-col h-[600px] items-center justify-center bg-slate-50">
        <p className="text-slate-500">No valid GPS coordinates available to render map.</p>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-[600px] overflow-hidden relative border border-slate-200">
      <CardHeader className="absolute top-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-sm border-b rounded-t-lg shadow-sm">
        <CardTitle>GPS Mapping</CardTitle>
        <CardDescription>Georeferenced crop health locations.</CardDescription>
      </CardHeader>
      <div className="flex-1 mt-20 relative">
        <MapContainer 
          center={[centerLat, centerLon]} 
          zoom={16} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <BoundsFitter data={validPoints} />
          {validPoints.map((point, idx) => (
            <GPSMarker key={idx} data={point} />
          ))}
        </MapContainer>
        <MapLegend />
      </div>
    </Card>
  )
}
