import { useMission } from '../../contexts/MissionContext'
import React, { useMemo } from 'react'
import { AlertCircle, RefreshCcw, Map as MapIcon, Download, Navigation, Route, Clock, ArrowUpToLine, ArrowDownToLine, FileText } from 'lucide-react'
import { Phase6Service } from '@/services/api/phase6Service'
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
import { MissionWaypointMarker } from '@/components/maps/MissionWaypointMarker'
import { MissionPolyline } from '@/components/maps/MissionPolyline'

export default function Phase6() {
  const { currentMission } = useMission()
  const { data, loading, error, refetch } = useApi(() => Phase6Service.getData(currentMission), [currentMission])

  const handleDownload = () => {
    Phase6Service.downloadMission(currentMission)
  }

  const metrics = useMemo(() => {
    const validData = data.filter(d => typeof d.lat === 'number' && typeof d.lon === 'number' && d.lat !== 0 && d.lon !== 0)
    const sortedData = [...validData].sort((a, b) => a.waypoint - b.waypoint)
    const distance = calculateTotalDistance(sortedData, 'lat', 'lon')
    const estTimeMins = (distance / 5 / 60) + (validData.length * 2 / 60)
    
    const takeoffPoint = sortedData.length > 0 ? sortedData[0] : null
    const landingPoint = sortedData.length > 0 ? sortedData[sortedData.length - 1] : null
    
    return {
      totalWaypoints: data.length,
      distance,
      estTimeMins,
      avgAltitude: calcMean(validData, 'alt'),
      maxAltitude: calcMax(validData, 'alt'),
      minAltitude: calcMin(validData, 'alt'),
      takeoffAlt: takeoffPoint ? takeoffPoint.alt : 0,
      landingCoord: landingPoint ? `${landingPoint.lat.toFixed(4)}, ${landingPoint.lon.toFixed(4)}` : 'N/A',
      validData: sortedData
    }
  }, [data])

  const mapData = useMemo(() => {
    const centerObj = calculateCenter(metrics.validData, 'lat', 'lon')
    const bounds = calculateBounds(centerObj.validPoints, 'lat', 'lon')
    return { center: [centerObj.lat, centerObj.lon] as [number, number], bounds, validPoints: centerObj.validPoints }
  }, [metrics.validData])

  const columns = [
    { key: 'waypoint', label: 'Waypoint', sortable: true },
    { key: 'lat', label: 'Latitude', sortable: true },
    { key: 'lon', label: 'Longitude', sortable: true },
    { key: 'alt', label: 'Altitude (m)', sortable: true },
    { key: 'command', label: 'Command', sortable: true },
    { key: 'frame', label: 'Frame', sortable: true },
    { key: 'autocontinue', label: 'Autocontinue', sortable: true }
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
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Phase 6 – Mission Planner</h2>
          <p className="text-slate-500 mt-1">Mission export and waypoint visualization compatible with UAV ground control software.</p>
        </div>
        <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
          <Download className="mr-2 h-4 w-4" />
          Download Mission
        </Button>
      </header>

      <MetricGrid>
        <SummaryCard title="Mission Name" value="Auto-Generated" icon={<FileText className="h-4 w-4"/>} />
        <SummaryCard title="Mission Version" value="QGC WPL 110" />
        <SummaryCard title="Total Waypoints" value={metrics.totalWaypoints} icon={<MapIcon className="h-4 w-4"/>} />
        <SummaryCard title="Takeoff Altitude" value={metrics.takeoffAlt.toFixed(1) + ' m'} icon={<ArrowUpToLine className="h-4 w-4 text-green-500"/>} />
        <SummaryCard title="Landing Point" value={metrics.landingCoord} valueClassName="text-sm pt-2" icon={<ArrowDownToLine className="h-4 w-4 text-red-500"/>} />
        <SummaryCard title="Est. Distance" value={metrics.distance.toFixed(0) + ' m'} icon={<Route className="h-4 w-4"/>} />
        <SummaryCard title="Est. Flight Time" value={metrics.estTimeMins.toFixed(1) + ' min'} icon={<Clock className="h-4 w-4"/>} />
      </MetricGrid>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <StatisticsCard 
            title="Statistics Panel"
            description="Mission flight metrics"
            items={[
              { label: 'Total Distance', value: metrics.distance.toFixed(1) + ' m', icon: <Route className="h-4 w-4"/> },
              { label: 'Average Altitude', value: metrics.avgAltitude.toFixed(1) + ' m' },
              { label: 'Max Altitude', value: metrics.maxAltitude.toFixed(1) + ' m', icon: <ArrowUpToLine className="h-4 w-4"/> },
              { label: 'Min Altitude', value: metrics.minAltitude.toFixed(1) + ' m', icon: <ArrowDownToLine className="h-4 w-4"/> },
              { label: 'Est Flight Time', value: metrics.estTimeMins.toFixed(1) + ' min', icon: <Clock className="h-4 w-4"/> },
              { label: 'Total Commands', value: metrics.totalWaypoints }
            ]}
          />
        </div>
        <div className="lg:col-span-3">
          <BaseMap
            title="QGC Waypoint Mission"
            description="Complete flight sequence including takeoff, sweep, and landing."
            center={mapData.center}
            bounds={mapData.bounds}
            isEmpty={mapData.validPoints.length === 0}
            emptyMessage="No valid mission waypoints to map."
          >
            <MissionPolyline data={mapData.validPoints} />
            {mapData.validPoints.map((point, idx) => {
              const isTakeoff = idx === 0
              const isLanding = idx === mapData.validPoints.length - 1
              return (
                <MissionWaypointMarker 
                  key={idx} 
                  data={point} 
                  isTakeoff={isTakeoff} 
                  isLanding={isLanding} 
                />
              )
            })
            }
          </BaseMap>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <CardTitle>Mission Waypoints Table</CardTitle>
            <CardDescription>Raw QGC compatible waypoint sequence.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            data={data}
            columns={columns}
            searchKey="waypoint"
          />
        </CardContent>
      </Card>
    </div>
  )
}



