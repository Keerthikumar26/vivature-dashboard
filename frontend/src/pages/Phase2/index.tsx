import { useMission } from '../../contexts/MissionContext'
import React, { useMemo, useState } from 'react'
import { AlertCircle, RefreshCcw, Map as MapIcon, Activity, Sprout } from 'lucide-react'
import { Phase2Service } from '@/services/api/phase2Service'
import { useApi } from '@/hooks/useApi'
import { calcMean } from '@/utils/statistics'
import { calculateCenter, calculateBounds } from '@/utils/geometry'
import { getHealthColor, createDivIcon } from '@/components/maps/MarkerFactory'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/common/DataTable'
import { MetricGrid } from '@/components/common/MetricGrid'
import { SummaryCard } from '@/components/common/SummaryCard'
import { FilterBar } from '@/components/common/FilterBar'
import { BaseMap } from '@/components/maps/BaseMap'
import { MapLegend } from '@/components/maps/MapLegend'
import { Marker, Popup } from 'react-leaflet'

export default function Phase2() {
  const { currentMission } = useMission()
  const { data, loading, error, refetch } = useApi(() => Phase2Service.getData(currentMission), [currentMission])
  const [filterHealth, setFilterHealth] = useState<string>('')
  const [filterSeverity, setFilterSeverity] = useState<string>('')

  const metrics = useMemo(() => {
    return {
      total: data.length,
      avgNdvi: calcMean(data, 'avg_ndvi') || calcMean(data, 'ndvi'),
      avgNdre: calcMean(data, 'avg_ndre') || calcMean(data, 'ndre'),
      healthy: data.filter(d => d.health_classification?.toLowerCase().includes('healthy')).length,
      moderate: data.filter(d => d.severity_level?.toLowerCase().includes('moderate')).length,
      severe: data.filter(d => d.severity_level?.toLowerCase().includes('severe')).length
    }
  }, [data])

  const mapData = useMemo(() => {
    const centerObj = calculateCenter(data, 'lat', 'lon')
    const bounds = calculateBounds(centerObj.validPoints, 'lat', 'lon')
    return { center: [centerObj.lat, centerObj.lon] as [number, number], bounds, validPoints: centerObj.validPoints }
  }, [data])

  const uniqueHealth = useMemo(() => Array.from(new Set(data.map(d => d.health_classification).filter(Boolean))), [data])
  const uniqueSeverity = useMemo(() => Array.from(new Set(data.map(d => d.severity_level).filter(Boolean))), [data])

  const columns = [
    { key: 'grid_id', label: 'Grid ID', sortable: true },
    { key: 'lat', label: 'Latitude', sortable: true },
    { key: 'lon', label: 'Longitude', sortable: true },
    { key: ('avg_ndvi' in (data[0] || {})) ? 'avg_ndvi' : 'ndvi', label: 'NDVI', sortable: true },
    { key: ('avg_ndre' in (data[0] || {})) ? 'avg_ndre' : 'ndre', label: 'NDRE', sortable: true },
    { key: 'vegetation_ratio', label: 'Vegetation Ratio', sortable: true },
    { key: 'severity_level', label: 'Severity', sortable: true },
    { key: 'health_classification', label: 'Health', sortable: true }
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
        <h2 className="text-3xl font-bold tracking-tight">Phase 2 – GPS Mapping</h2>
        <p className="text-slate-500 mt-1">Visualization of georeferenced crop health locations.</p>
      </header>

      <MetricGrid>
        <SummaryCard title="Total GPS Points" value={metrics.total} icon={<MapIcon className="h-4 w-4"/>} />
        <SummaryCard title="Avg NDVI" value={metrics.avgNdvi.toFixed(3)} />
        <SummaryCard title="Avg NDRE" value={metrics.avgNdre.toFixed(3)} />
        <SummaryCard title="Healthy Locs" value={metrics.healthy} valueClassName="text-green-600" icon={<Sprout className="h-4 w-4 text-green-500"/>} />
        <SummaryCard title="Moderate Locs" value={metrics.moderate} valueClassName="text-amber-600" icon={<AlertCircle className="h-4 w-4 text-amber-500"/>} />
        <SummaryCard title="Severe Locs" value={metrics.severe} valueClassName="text-red-600" icon={<AlertCircle className="h-4 w-4 text-red-500"/>} />
      </MetricGrid>

      <BaseMap
        title="GPS Mapping"
        description="Georeferenced crop health locations."
        center={mapData.center}
        bounds={mapData.bounds}
        isEmpty={mapData.validPoints.length === 0}
      >
        {mapData.validPoints.map((point, idx) => {
          const color = getHealthColor(point.severity_level, point.health_classification)
          const icon = createDivIcon(color, 12)
          return (
            <Marker key={idx} position={[point.lat, point.lon]} icon={icon}>
              <Popup>
                <div className="text-sm">
                  <strong>Grid ID:</strong> {point.grid_id}<br/>
                  <strong>Lat:</strong> {point.lat.toFixed(6)}<br/>
                  <strong>Lon:</strong> {point.lon.toFixed(6)}<br/>
                  <strong>Severity:</strong> {point.severity_level}<br/>
                  <strong>Health:</strong> {point.health_classification}
                </div>
              </Popup>
            </Marker>
          )
        })}
        <MapLegend />
      </BaseMap>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div>
            <CardTitle>GPS Records Table</CardTitle>
            <CardDescription>Detailed georeferenced metrics for every point.</CardDescription>
          </div>
          <div className="flex space-x-2">
            <FilterBar value={filterHealth} options={uniqueHealth.map(u => ({label: String(u), value: String(u)}))} onChange={setFilterHealth} defaultLabel="All Health" />
            <FilterBar value={filterSeverity} options={uniqueSeverity.map(u => ({label: String(u), value: String(u)}))} onChange={setFilterSeverity} defaultLabel="All Severities" />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            data={data}
            columns={columns}
            searchKey="grid_id"
            filters={{ health_classification: filterHealth, severity_level: filterSeverity }}
          />
        </CardContent>
      </Card>
    </div>
  )
}


