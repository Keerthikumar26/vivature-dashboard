import React from 'react'
import { useEffect, useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { MetricGrid } from '@/components/common/MetricGrid'
import { SummaryCard } from '@/components/common/SummaryCard'
import { Phase1Service } from '@/services/api/phase1Service'
import { Phase2Service } from '@/services/api/phase2Service'
import { Phase3Service } from '@/services/api/phase3Service'
import { Phase4Service } from '@/services/api/phase4Service'
import { Phase5Service } from '@/services/api/phase5Service'
import { calcMean } from '@/utils/statistics'
import { calculateTotalDistance } from '@/utils/geometry'
import {
  Layers, Map as MapIcon, Navigation, Route,
  Droplets, Target, Sprout, AlertCircle, Loader2
} from 'lucide-react'

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'

const RechartsLoaded = true;

// ââ Chart components âââââââââââââââââââââ

const ChartBox = ({ children }: { children: React.ReactNode }) => <>{children}</>

const NDVILineChart = React.memo(({ data }: { data: any[] }) => {
  if (!RechartsLoaded || !data.length) return null
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="grid_id" tick={{ fontSize: 11 }} />
        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="ndvi" name="NDVI" stroke="#22c55e" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="ndre" name="NDRE" stroke="#3b82f6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
})

const SeverityBarChart = React.memo(({ data }: { data: any[] }) => {
  if (!RechartsLoaded || !data.length) return null
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip cursor={{ fill: 'transparent' }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
})

const HealthPieChart = React.memo(({ data }: { data: any[] }) => {
  if (!RechartsLoaded || !data.length) return null
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data} cx="50%" cy="50%"
          innerRadius={60} outerRadius={100} paddingAngle={5}
          dataKey="value"
          label={({ name, percent }: any) => `${String(name)} (${((percent || 0) * 100).toFixed(0)}%)`}
        >
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
})

const SprayAreaChart = React.memo(({ data }: { data: any[] }) => {
  if (!RechartsLoaded || !data.length) return null
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="sequence" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="spray_rate" name="Spray Rate (L/ha)" stroke="#3b82f6" fillOpacity={0.3} fill="#3b82f6" />
      </AreaChart>
    </ResponsiveContainer>
  )
})

// ââ Page ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

export default function Analytics() {
  const [allData, setAllData] = useState<any>({ p1: [], p2: [], p3: [], p4: [], p5: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchAll = async () => {
      try {
        const [p1, p2, p3, p4, p5] = await Promise.all([
          Phase1Service.getData(),
          Phase2Service.getData(),
          Phase3Service.getData(),
          Phase4Service.getData(),
          Phase5Service.getData(),
        ])
        if (!cancelled) setAllData({ p1, p2, p3, p4, p5 })
      } catch (err) {
        console.warn('[Analytics] fetch failed', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [])

  const metrics = useMemo(() => {
    const p1: any[] = Array.isArray(allData.p1) ? allData.p1 : []
    const p2: any[] = Array.isArray(allData.p2) ? allData.p2 : []
    const p3: any[] = Array.isArray(allData.p3) ? allData.p3 : []
    const p4: any[] = Array.isArray(allData.p4) ? [...allData.p4].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0)) : []
    const p5: any[] = Array.isArray(allData.p5) ? allData.p5 : []

    const totalDistance = calculateTotalDistance(p4, 'lat', 'lon')
    const totalVolume   = p5.reduce((s: number, d: any) => s + (Number(d.spray_rate) || 0), 0)
    const missionTime   = totalDistance / 5 / 60 + p5.reduce((s: number, d: any) => s + (Number(d.duration) || 0), 0) / 60
    const avgNdvi = calcMean(p1, 'avg_ndvi') || calcMean(p1, 'ndvi')
    const avgNdre = calcMean(p1, 'avg_ndre') || calcMean(p1, 'ndre')

    return {
      totalFields: p1.length, totalGps: p2.length,
      totalZones: p3.length, totalWaypoints: p4.length,
      totalSprayPoints: p5.length,
      avgNdvi, avgNdre, totalDistance, totalVolume, missionTime,
    }
  }, [allData])

  const chartData = useMemo(() => {
    const p1: any[] = Array.isArray(allData.p1) ? allData.p1 : []
    const p5: any[] = Array.isArray(allData.p5) ? allData.p5 : []

    const step = Math.max(1, Math.floor(p1.length / 50))
    const lineData = p1
      .filter((_: any, i: number) => i % step === 0)
      .map((d: any) => ({
        grid_id: d.grid_id ?? '',
        ndvi: Number(d.avg_ndvi ?? d.ndvi) || 0,
        ndre: Number(d.avg_ndre ?? d.ndre) || 0,
      }))

    const sevCounts = { Low: 0, Moderate: 0, High: 0 }
    p1.forEach((d: any) => {
      const s = String(d.severity_level ?? d.severity ?? '').toLowerCase()
      if (s.includes('low'))      sevCounts.Low++
      else if (s.includes('mod')) sevCounts.Moderate++
      else if (s.includes('hig') || s.includes('sev')) sevCounts.High++
    })
    const barData = [
      { name: 'Low',       value: sevCounts.Low,      color: '#22c55e' },
      { name: 'Moderate',  value: sevCounts.Moderate,  color: '#f97316' },
      { name: 'High/Severe', value: sevCounts.High,   color: '#ef4444' },
    ].filter(d => d.value > 0)

    const healthCounts = { Healthy: 0, Stressed: 0 }
    p1.forEach((d: any) => {
      const h = String(d.health_classification ?? '').toLowerCase()
      if (h.includes('healthy')) healthCounts.Healthy++
      else healthCounts.Stressed++
    })
    const pieData = [
      { name: 'Healthy',  value: healthCounts.Healthy,  color: '#22c55e' },
      { name: 'Stressed', value: healthCounts.Stressed, color: '#ef4444' },
    ]
    const areaData = [...p5].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))

    return { lineData, barData, pieData, areaData }
  }, [allData])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      <span className="ml-3 text-slate-500">Loading analyticsâ¦</span>
    </div>
  )

  const noData = (
    <div className="h-[300px] flex items-center justify-center text-slate-400 text-sm">
      No data available
    </div>
  )

  return (
    <div className="space-y-6 pb-10">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-slate-500 mt-1">Cross-phase aggregated metrics and historical flight analytics.</p>
      </header>

      <MetricGrid>
        <SummaryCard title="Total Field Grids"   value={metrics.totalFields}               icon={<Layers    className="h-4 w-4" />} />
        <SummaryCard title="Total GPS Points"     value={metrics.totalGps}                  icon={<MapIcon   className="h-4 w-4" />} />
        <SummaryCard title="Total Stress Zones"   value={metrics.totalZones}                icon={<AlertCircle className="h-4 w-4 text-amber-500" />} />
        <SummaryCard title="Total Waypoints"      value={metrics.totalWaypoints}            icon={<Navigation className="h-4 w-4 text-blue-500" />} />
        <SummaryCard title="Total Spray Points"   value={metrics.totalSprayPoints}          icon={<Target    className="h-4 w-4 text-purple-500" />} />
        <SummaryCard title="Total Spray Volume"   value={metrics.totalVolume.toFixed(1) + ' L'} icon={<Droplets className="h-4 w-4 text-blue-500" />} />
        <SummaryCard title="Total Flight Dist."   value={metrics.totalDistance.toFixed(0) + ' m'} icon={<Route className="h-4 w-4 text-slate-500" />} />
        <SummaryCard title="Est. Mission Time"    value={metrics.missionTime.toFixed(1) + ' min'} />
        <SummaryCard title="Average NDVI"         value={metrics.avgNdvi.toFixed(3)}        icon={<Sprout className="h-4 w-4 text-green-500" />} />
        <SummaryCard title="Average NDRE"         value={metrics.avgNdre.toFixed(3)}        icon={<Sprout className="h-4 w-4 text-blue-500" />} />
      </MetricGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Multispectral Indices (NDVI &amp; NDRE)</CardTitle>
            <CardDescription>Vegetation health comparison across the field grid.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartBox>
              {chartData.lineData.length > 0 ? <NDVILineChart data={chartData.lineData} /> : noData}
            </ChartBox>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stress Severity Distribution</CardTitle>
            <CardDescription>Grid breakdown by severity levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartBox>
              {chartData.barData.length > 0 ? <SeverityBarChart data={chartData.barData} /> : noData}
            </ChartBox>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Health Classification</CardTitle>
            <CardDescription>Overall healthy vs stressed grid ratio.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartBox>
              {chartData.pieData.some(d => d.value > 0) ? <HealthPieChart data={chartData.pieData} /> : noData}
            </ChartBox>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variable Spray Rate Mission</CardTitle>
            <CardDescription>Dispensed volume allocation across mission sequence.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartBox>
              {chartData.areaData.length > 0 ? <SprayAreaChart data={chartData.areaData} /> : noData}
            </ChartBox>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
