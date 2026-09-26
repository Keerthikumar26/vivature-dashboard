import { useMission } from '../../contexts/MissionContext'
import { useMemo, useState } from "react"
import { AlertCircle, RefreshCcw, Droplets, Target, Timer, ArrowUpToLine, ArrowDownToLine, Navigation } from 'lucide-react'
import { Phase5Service } from '@/services/api/phase5Service'
import { useApi } from '@/hooks/useApi'
import { calcMean, calcMax, calcMin } from '@/utils/statistics'
import { calculateCenter, calculateBounds } from '@/utils/geometry'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/common/DataTable'
import { MetricGrid } from '@/components/common/MetricGrid'
import { SummaryCard } from '@/components/common/SummaryCard'
import { StatisticsCard } from '@/components/common/StatisticsCard'
import { BaseMap } from '@/components/maps/BaseMap'
import { SprayMarker } from '@/components/maps/SprayMarker'
import { CoveragePath } from '@/components/maps/CoveragePath'
import { FilterBar } from '@/components/common/FilterBar'

export default function Phase5() {
  const { currentMission } = useMission()
  const { data, loading, error, refetch } = useApi(() => Phase5Service.getData(currentMission), [currentMission])
  const [filterZone, setFilterZone] = useState<string>('')
  const [filterRateLevel, setFilterRateLevel] = useState<string>('')

  const metrics = useMemo(() => {
    const totalVolume = data.reduce((sum, d) => sum + (0.2 * ((d.spray_rate || 0) / 100) * (d.duration || 0)), 0)
    const maxRate = calcMax(data, 'spray_rate')
    const avgRate = calcMean(data, 'spray_rate')
    const minRate = calcMin(data, 'spray_rate')
    const totalDuration = data.reduce((sum, d) => sum + (d.duration || 0), 0)
    
    return {
      totalPoints: data.length,
      totalVolume,
      avgRate,
      maxRate,
      minRate,
      avgAltitude: calcMean(data, 'alt'),
      totalDuration
    }
  }, [data])

  const mapData = useMemo(() => {
    const sortedData = [...data].sort((a, b) => a.sequence - b.sequence)
    const centerObj = calculateCenter(sortedData, 'lat', 'lon')
    const bounds = calculateBounds(centerObj.validPoints, 'lat', 'lon')
    return { center: [centerObj.lat, centerObj.lon] as [number, number], bounds, validPoints: centerObj.validPoints }
  }, [data])

  const uniqueZones = useMemo(() => Array.from(new Set(data.map(d => d.target_zone).filter(Boolean))), [data])

  const displayData = useMemo(() => {
    return data.filter(d => {
      let passRate = true;
      if (filterRateLevel) {
        const ratio = (d.spray_rate || 0) / (metrics.maxRate || 1)
        if (filterRateLevel === 'High') passRate = ratio > 0.66
        else if (filterRateLevel === 'Medium') passRate = ratio > 0.33 && ratio <= 0.66
        else if (filterRateLevel === 'Low') passRate = ratio <= 0.33
      }
      return passRate;
    })
  }, [data, filterRateLevel, metrics.maxRate])

  const columns = [
    { key: 'sequence', label: 'Sequence', sortable: true },
    { key: 'lat', label: 'Latitude', sortable: true },
    { key: 'lon', label: 'Longitude', sortable: true },
    { key: 'alt', label: 'Altitude (m)', sortable: true },
    { key: 'spray_rate', label: 'Spray Rate', sortable: true },
    { key: 'flow_rate', label: 'Flow Rate', sortable: true },
    { key: 'pwm', label: 'PWM', sortable: true },
    { key: 'duration', label: 'Duration (s)', sortable: true },
    { key: 'target_zone', label: 'Target Zone', sortable: true }
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
        <h2 className="text-3xl font-bold tracking-tight">Phase 5 ï¿½ Variable Rate Spray Mission</h2>
        <p className="text-slate-500 mt-1">Visualization of the optimized variable-rate spraying mission generated from the stress-zone analysis.</p>
      </header>

      <MetricGrid>
        <SummaryCard title="Total Spray Points" value={metrics.totalPoints} icon={<Target className="h-4 w-4"/>} />
        <SummaryCard title="Total Spray Volume" value={metrics.totalVolume.toFixed(1) + ' L'} icon={<Droplets className="h-4 w-4 text-blue-500"/>} />
        <SummaryCard title="Avg Spray Rate" value={metrics.avgRate.toFixed(2) + ' L/ha'} />
        <SummaryCard title="Max Spray Rate" value={metrics.maxRate.toFixed(2) + ' L/ha'} icon={<ArrowUpToLine className="h-4 w-4 text-red-500"/>} />
        <SummaryCard title="Avg Altitude" value={metrics.avgAltitude.toFixed(1) + ' m'} icon={<Navigation className="h-4 w-4"/>} />
        <SummaryCard title="Mission Duration" value={(metrics.totalDuration / 60).toFixed(1) + ' min'} icon={<Timer className="h-4 w-4"/>} />
      </MetricGrid>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <StatisticsCard 
            title="Statistics Panel"
            description="Mission spray insights"
            items={[
              { label: 'Min Spray Rate', value: metrics.minRate.toFixed(2) + ' L/ha', icon: <ArrowDownToLine className="h-4 w-4 text-green-500"/> },
              { label: 'Max Spray Rate', value: metrics.maxRate.toFixed(2) + ' L/ha', icon: <ArrowUpToLine className="h-4 w-4 text-red-500"/> },
              { label: 'Avg Spray Rate', value: metrics.avgRate.toFixed(2) + ' L/ha' },
              { label: 'Total Volume', value: metrics.totalVolume.toFixed(1) + ' L', icon: <Droplets className="h-4 w-4 text-blue-500"/> },
              { label: 'Avg Altitude', value: metrics.avgAltitude.toFixed(1) + ' m', icon: <Navigation className="h-4 w-4"/> },
              { label: 'Est Duration', value: (metrics.totalDuration / 60).toFixed(1) + ' min', icon: <Timer className="h-4 w-4"/> }
            ]}
          />
        </div>
        <div className="lg:col-span-3">
          <BaseMap
            title="Variable Rate Spray Map"
            description="Mission path and corresponding spray volumes."
            center={mapData.center}
            bounds={mapData.bounds}
            isEmpty={mapData.validPoints.length === 0}
            emptyMessage="No valid spray points to map."
          >
            <CoveragePath data={mapData.validPoints} />
            {mapData.validPoints.map((point, idx) => (
              <SprayMarker key={idx} data={point} maxSprayRate={metrics.maxRate} />
            ))}
          </BaseMap>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <CardTitle>Spray Mission Table</CardTitle>
            <CardDescription>Detailed sequence of variable rate spraying actions.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <FilterBar value={filterRateLevel} options={[{label:'Low', value:'Low'},{label:'Medium', value:'Medium'},{label:'High', value:'High'}]} onChange={setFilterRateLevel} defaultLabel="All Spray Rates" />
            <FilterBar value={filterZone} options={uniqueZones.map(u => ({label: String(u), value: String(u)}))} onChange={setFilterZone} defaultLabel="All Target Zones" />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            data={displayData}
            columns={columns}
            searchKey="sequence"
            filters={{ target_zone: filterZone }}
          />
        </CardContent>
      </Card>
    </div>
  )
}



