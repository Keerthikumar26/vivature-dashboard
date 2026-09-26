import { useMission } from '../../contexts/MissionContext'
import { useMemo } from 'react'
import { AlertCircle, RefreshCcw, Map as MapIcon, Navigation, Route, Clock, ArrowUpToLine, ArrowDownToLine, CheckCircle2 } from 'lucide-react'
import { Phase4Service } from '@/services/api/phase4Service'
import { useApi } from '@/hooks/useApi'
import { calcMean, calcMax, calcMin } from '@/utils/statistics'
import { calculateCenter, calculateBounds, calculateTotalDistance } from '@/utils/geometry'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/common/DataTable'
import { MetricGrid } from '@/components/common/MetricGrid'
import { SummaryCard } from '@/components/common/SummaryCard'
import { StatisticsCard } from '@/components/common/StatisticsCard'
import { BaseMap } from '@/components/maps/BaseMap'
import { WaypointMarker } from '@/components/maps/WaypointMarker'
import { CoveragePath } from '@/components/maps/CoveragePath'

export default function Phase4() {
  const { currentMission } = useMission()
  const { data, loading, error, refetch } = useApi(() => Phase4Service.getData(currentMission), [currentMission])

  const metrics = useMemo(() => {
    const totalWaypoints = data.length
    const sortedData = [...data].sort((a, b) => a.sequence - b.sequence)
    const distance = calculateTotalDistance(sortedData, 'lat', 'lon')
    const estTimeMins = (distance / 5 / 60) + (totalWaypoints * 2 / 60) // 5 m/s speed + 2s hover per point
    
    return {
      totalWaypoints,
      distance,
      estTimeMins,
      avgAltitude: calcMean(data, 'alt'),
      maxAltitude: calcMax(data, 'alt'),
      minAltitude: calcMin(data, 'alt'),
      avgSpacing: totalWaypoints > 1 ? distance / (totalWaypoints - 1) : 0,
      coverageArea: distance * 3, // Assuming 3m spray width
      coverageEfficiency: totalWaypoints > 0 ? 94.5 : 0 // Static mock for efficiency
    }
  }, [data])

  const mapData = useMemo(() => {
    const sortedData = [...data].sort((a, b) => a.sequence - b.sequence)
    const centerObj = calculateCenter(sortedData, 'lat', 'lon')
    const bounds = calculateBounds(centerObj.validPoints, 'lat', 'lon')
    return { center: [centerObj.lat, centerObj.lon] as [number, number], bounds, validPoints: centerObj.validPoints }
  }, [data])

  const columns = [
    { key: 'sequence', label: 'Sequence', sortable: true },
    { key: 'lat', label: 'Latitude', sortable: true },
    { key: 'lon', label: 'Longitude', sortable: true },
    { key: 'alt', label: 'Altitude (m)', sortable: true },
    { key: 'path_type', label: 'Path Type', sortable: true }
  ]

  if (loading) return <div className="animate-pulse h-[800px] bg-slate-100 rounded-lg" />
  if (error) return (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <p className="text-slate-500">{error}</p>
      <Button onClick={refetch} className="mt-4"><RefreshCcw className="mr-2 h-4 w-4" /> Retry</Button>
    </div>
  )

  return (
    <div className="space-y-6 pb-10">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Phase 4 ï¿½ Coverage Path Planning</h2>
        <p className="text-slate-500 mt-1">Visualization of optimized UAV flight path generated for spraying operations.</p>
      </header>

      <MetricGrid>
        <SummaryCard title="Total Waypoints" value={metrics.totalWaypoints} icon={<MapIcon className="h-4 w-4"/>} />
        <SummaryCard title="Flight Distance" value={metrics.distance.toFixed(0) + ' m'} icon={<Route className="h-4 w-4"/>} />
        <SummaryCard title="Est. Flight Time" value={metrics.estTimeMins.toFixed(1) + ' min'} icon={<Clock className="h-4 w-4"/>} />
        <SummaryCard title="Avg Altitude" value={metrics.avgAltitude.toFixed(1) + ' m'} icon={<Navigation className="h-4 w-4"/>} />
        <SummaryCard title="Max Altitude" value={metrics.maxAltitude.toFixed(1) + ' m'} icon={<ArrowUpToLine className="h-4 w-4"/>} />
        <SummaryCard title="Coverage Efficiency" value={metrics.coverageEfficiency.toFixed(1) + ' %'} valueClassName="text-green-600" icon={<CheckCircle2 className="h-4 w-4 text-green-500"/>} />
      </MetricGrid>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <StatisticsCard 
            title="Statistics Panel"
            description="Path planning metrics"
            items={[
              { label: 'Total Distance', value: metrics.distance.toFixed(1) + ' m', icon: <Route className="h-4 w-4"/> },
              { label: 'Avg Waypoint Spacing', value: metrics.avgSpacing.toFixed(2) + ' m' },
              { label: 'Max Altitude', value: metrics.maxAltitude.toFixed(1) + ' m', icon: <ArrowUpToLine className="h-4 w-4"/> },
              { label: 'Min Altitude', value: metrics.minAltitude.toFixed(1) + ' m', icon: <ArrowDownToLine className="h-4 w-4"/> },
              { label: 'Est Flight Time', value: metrics.estTimeMins.toFixed(1) + ' min', icon: <Clock className="h-4 w-4"/> },
              { label: 'Coverage Area', value: metrics.coverageArea.toFixed(0) + ' mï¿½' }
            ]}
          />
        </div>
        <div className="lg:col-span-3">
          <BaseMap
            title="Optimized Flight Path"
            description="UAV waypoints and traversal trajectory."
            center={mapData.center}
            bounds={mapData.bounds}
            isEmpty={mapData.validPoints.length === 0}
            emptyMessage="No valid waypoints to map."
          >
            <CoveragePath data={mapData.validPoints} />
            {mapData.validPoints.map((point, idx) => (
              <WaypointMarker key={idx} data={point} />
            ))}
          </BaseMap>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <CardTitle>Waypoint Sequence Table</CardTitle>
            <CardDescription>Detailed coordinate sequence for the UAV mission.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            data={data}
            columns={columns}
            searchKey="sequence"
          />
        </CardContent>
      </Card>
    </div>
  )
}



