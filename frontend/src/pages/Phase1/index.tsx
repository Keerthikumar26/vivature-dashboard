import { useMission } from '../../contexts/MissionContext'
import { useMemo, useState } from "react"
import { AlertCircle, RefreshCcw, Sprout, Activity, ArrowDownToLine, ArrowUpToLine } from 'lucide-react'
import { Phase1Service } from '@/services/api/phase1Service'
import { useApi } from '@/hooks/useApi'
import { calcMean, calcMax, calcMin } from '@/utils/statistics'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/common/DataTable'
import { MetricGrid } from '@/components/common/MetricGrid'
import { SummaryCard } from '@/components/common/SummaryCard'
import { StatisticsCard } from '@/components/common/StatisticsCard'
import { FilterBar } from '@/components/common/FilterBar'

export default function Phase1() {
  const { currentMission } = useMission()
  const { data, loading, error, refetch } = useApi(() => Phase1Service.getData(currentMission), [currentMission])
  const [filterHealth, setFilterHealth] = useState<string>('')
  const [filterSeverity, setFilterSeverity] = useState<string>('')

  const metrics = useMemo(() => {
    return {
      total: data.length,
      avgNdvi: calcMean(data, 'avg_ndvi') || calcMean(data, 'ndvi'),
      avgNdre: calcMean(data, 'avg_ndre') || calcMean(data, 'ndre'),
      healthy: data.filter(d => d.health_classification?.toLowerCase().includes('healthy')).length,
      moderate: data.filter(d => d.severity_level?.toLowerCase().includes('moderate')).length,
      severe: data.filter(d => d.severity_level?.toLowerCase().includes('severe')).length,
      highNdvi: calcMax(data, 'avg_ndvi') || calcMax(data, 'ndvi'),
      lowNdvi: calcMin(data, 'avg_ndvi') || calcMin(data, 'ndvi'),
      highNdre: calcMax(data, 'avg_ndre') || calcMax(data, 'ndre'),
      lowNdre: calcMin(data, 'avg_ndre') || calcMin(data, 'ndre'),
      avgVeg: calcMean(data, 'vegetation_ratio')
    }
  }, [data])

  const uniqueHealth = useMemo(() => Array.from(new Set(data.map(d => d.health_classification).filter(Boolean))), [data])
  const uniqueSeverity = useMemo(() => Array.from(new Set(data.map(d => d.severity_level).filter(Boolean))), [data])

  const columns = [
    { key: 'grid_id', label: 'Grid ID', sortable: true },
    { key: ('avg_ndvi' in (data[0] || {})) ? 'avg_ndvi' : 'ndvi', label: 'Average NDVI', sortable: true },
    { key: ('avg_ndre' in (data[0] || {})) ? 'avg_ndre' : 'ndre', label: 'Average NDRE', sortable: true },
    { key: 'vegetation_ratio', label: 'Vegetation Ratio', sortable: true },
    { key: 'health_classification', label: 'Health Classification', sortable: true },
    { key: 'severity_level', label: 'Severity Level', sortable: true }
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
        <h2 className="text-3xl font-bold tracking-tight">Phase 1  Crop Health Analysis</h2>
        <p className="text-slate-500 mt-1">Visualization of multispectral crop health metrics generated from the Phase 1 pipeline.</p>
      </header>

      <MetricGrid>
        <SummaryCard title="Total Grids" value={metrics.total} icon={<Activity className="h-4 w-4"/>} />
        <SummaryCard title="Avg NDVI" value={metrics.avgNdvi.toFixed(3)} />
        <SummaryCard title="Avg NDRE" value={metrics.avgNdre.toFixed(3)} />
        <SummaryCard title="Healthy Grids" value={metrics.healthy} valueClassName="text-green-600" icon={<Sprout className="h-4 w-4 text-green-500"/>} />
        <SummaryCard title="Moderate Stress" value={metrics.moderate} valueClassName="text-amber-600" icon={<AlertCircle className="h-4 w-4 text-amber-500"/>} />
        <SummaryCard title="Severe Stress" value={metrics.severe} valueClassName="text-red-600" icon={<AlertCircle className="h-4 w-4 text-red-500"/>} />
      </MetricGrid>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <StatisticsCard 
            title="Statistics Panel"
            description="Extremes across the field"
            items={[
              { label: 'Highest NDVI', value: metrics.highNdvi.toFixed(3), icon: <ArrowUpToLine className="h-4 w-4 text-green-500"/> },
              { label: 'Lowest NDVI', value: metrics.lowNdvi.toFixed(3), icon: <ArrowDownToLine className="h-4 w-4 text-red-500"/> },
              { label: 'Highest NDRE', value: metrics.highNdre.toFixed(3), icon: <ArrowUpToLine className="h-4 w-4 text-green-500"/> },
              { label: 'Lowest NDRE', value: metrics.lowNdre.toFixed(3), icon: <ArrowDownToLine className="h-4 w-4 text-red-500"/> },
              { label: 'Avg Veg Ratio', value: metrics.avgVeg.toFixed(3) }
            ]}
          />
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
              <div>
                <CardTitle>Field Data Records</CardTitle>
                <CardDescription>Detailed metrics for every grid.</CardDescription>
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
      </div>
    </div>
  )
}


