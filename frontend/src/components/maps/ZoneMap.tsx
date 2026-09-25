import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Phase3Data } from '@/types'
import { ZoneMarker } from './ZoneMarker'
import { ZoneLegend } from './ZoneLegend'

interface ZoneMapProps {
  data: Phase3Data[];
}

function BoundsFitter({ data }: { data: Phase3Data[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (data.length > 0) {
      const validPoints = data.filter(d => typeof (d.center_lat ?? d.lat) === 'number' && typeof (d.center_lon ?? d.lon) === 'number')
      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints.map(d => [d.center_lat ?? d.lat, d.center_lon ?? d.lon]))
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [data, map])
  
  return null
}

export function ZoneMap({ data }: ZoneMapProps) {
  const validPoints = data.filter(d => typeof (d.center_lat ?? d.lat) === 'number' && typeof (d.center_lon ?? d.lon) === 'number')
  const centerLat = validPoints.length > 0 ? validPoints.reduce((sum, d) => sum + (d.center_lat ?? d.lat), 0) / validPoints.length : 0;
  const centerLon = validPoints.length > 0 ? validPoints.reduce((sum, d) => sum + (d.center_lon ?? d.lon), 0) / validPoints.length : 0;

  if (validPoints.length === 0) {
    return (
      <Card className="flex flex-col h-[600px] items-center justify-center bg-slate-50">
        <p className="text-slate-500">No valid clustered stress zones to map.</p>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-[600px] overflow-hidden relative border border-slate-200">
      <CardHeader className="absolute top-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-sm border-b rounded-t-lg shadow-sm">
        <CardTitle>Stress Zone Clusters</CardTitle>
        <CardDescription>Spatial distribution of detected agricultural stress.</CardDescription>
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
          {validPoints.map((zone, idx) => (
            <ZoneMarker key={idx} data={zone} />
          ))}
        </MapContainer>
        <ZoneLegend />
      </div>
    </Card>
  )
}
