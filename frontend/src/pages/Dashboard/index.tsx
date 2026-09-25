import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Sprout, Map, AlertTriangle, Route,
  PlaneTakeoff, Flag, CheckCircle2, XCircle,
  Loader2, Clock
} from 'lucide-react'
import apiClient from '@/services/api'
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle
} from '@/components/ui/card'

interface PhaseData {
  status: 'loading' | 'success' | 'error' | 'idle'
  data: any[]
  error: string | null
  lastUpdated: string | null
}

const initialPhaseState: PhaseData = {
  status: 'idle',
  data: [],
  error: null,
  lastUpdated: null,
}

const safeErrorMessage = (err: any): string => {
  if (!err) return 'Unknown error'
  if (err.response?.data?.detail) {
    const d = err.response.data.detail
    if (typeof d === 'string') return d
    try { return JSON.stringify(d) } catch { return 'Request failed' }
  }
  if (typeof err.message === 'string') return err.message
  return 'Request failed'
}

export default function Dashboard() {
  const [phase1, setPhase1] = useState<PhaseData>(initialPhaseState)
  const [phase2, setPhase2] = useState<PhaseData>(initialPhaseState)
  const [phase3, setPhase3] = useState<PhaseData>(initialPhaseState)
  const [phase4, setPhase4] = useState<PhaseData>(initialPhaseState)
  const [phase5, setPhase5] = useState<PhaseData>(initialPhaseState)
  const [phase6, setPhase6] = useState<PhaseData>(initialPhaseState)

  useEffect(() => {
    const fetchPhase = async (
      endpoint: string,
      setter: React.Dispatch<React.SetStateAction<PhaseData>>
    ) => {
      setter((prev) => ({ ...prev, status: 'loading' }))
      try {
        const response = await apiClient.get(endpoint)
        const data = Array.isArray(response.data) ? response.data : []
        setter({ status: 'success', data, error: null, lastUpdated: new Date().toLocaleTimeString() })
      } catch (err: any) {
        setter({
          status: 'error',
          data: [],
          error: safeErrorMessage(err),
          lastUpdated: new Date().toLocaleTimeString(),
        })
      }
    }

    fetchPhase('/phase1', setPhase1)
    fetchPhase('/phase2', setPhase2)
    fetchPhase('/phase3', setPhase3)
    fetchPhase('/phase4', setPhase4)
    fetchPhase('/phase5', setPhase5)
    fetchPhase('/phase6', setPhase6)
  }, [])

  const calcMean = (data: any[], key: string): string => {
    const valid = data.filter((d) => typeof d[key] === 'number')
    if (valid.length === 0) return 'N/A'
    const sum = valid.reduce((acc, curr) => acc + curr[key], 0)
    return (sum / valid.length).toFixed(3)
  }

  const avgNdvi = phase1.status === 'success' ? calcMean(phase1.data, 'avg_ndvi') || calcMean(phase1.data, 'ndvi') : '...'
  const avgNdre = phase1.status === 'success' ? calcMean(phase1.data, 'avg_ndre') || calcMean(phase1.data, 'ndre') : '...'

  const pipelineStages = [
    { name: 'Phase 1 – Field Report',    state: phase1 },
    { name: 'Phase 2 – GPS Report',      state: phase2 },
    { name: 'Phase 3 – Spray Zones',     state: phase3 },
    { name: 'Phase 4 – Coverage Path',   state: phase4 },
    { name: 'Phase 5 – Spray Mission',   state: phase5 },
    { name: 'Phase 6 – Waypoints',       state: phase6 },
  ]

  const quickNav = [
    { name: 'Crop Health',    href: '/phase1', icon: Sprout,       color: 'text-green-600' },
    { name: 'GPS Mapping',    href: '/phase2', icon: Map,          color: 'text-blue-600' },
    { name: 'Stress Zones',   href: '/phase3', icon: AlertTriangle, color: 'text-amber-500' },
    { name: 'Coverage Path',  href: '/phase4', icon: Route,        color: 'text-purple-600' },
    { name: 'Spray Mission',  href: '/phase5', icon: PlaneTakeoff, color: 'text-indigo-600' },
    { name: 'Mission Planner',href: '/phase6', icon: Flag,         color: 'text-rose-600' },
  ]

  const statusText = (s: PhaseData): string => {
    if (s.status === 'success') return 'Completed successfully'
    if (s.status === 'error')   return s.error ?? 'Error'
    if (s.status === 'loading') return 'Loading...'
    return 'Pending'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-1">
          Monitor your UAV-assisted precision agriculture pipeline.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Field Grids</CardTitle>
            <Sprout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {phase1.status === 'success' ? phase1.data.length : phase1.status === 'error' ? '0' : '...'}
            </div>
            <p className="text-xs text-muted-foreground">From Phase 1</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average NDVI</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgNdvi}</div>
            <p className="text-xs text-muted-foreground">Crop Vitality</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average NDRE</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgNdre}</div>
            <p className="text-xs text-muted-foreground">Chlorophyll Content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stress Zones</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {phase3.status === 'success' ? phase3.data.length : phase3.status === 'error' ? '0' : '...'}
            </div>
            <p className="text-xs text-muted-foreground">Detected across field</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Waypoints</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {phase4.status === 'success' ? phase4.data.length : phase4.status === 'error' ? '0' : '...'}
            </div>
            <p className="text-xs text-muted-foreground">Generated Path</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spray Missions</CardTitle>
            <PlaneTakeoff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {phase5.status === 'success' ? phase5.data.length : phase5.status === 'error' ? '0' : '...'}
            </div>
            <p className="text-xs text-muted-foreground">Optimised Routes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Pipeline Status */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Pipeline Status</CardTitle>
            <CardDescription>Status of the six image-processing phases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipelineStages.map((stage, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    {stage.state.status === 'loading' && (
                      <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                    )}
                    {stage.state.status === 'success' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {stage.state.status === 'error' && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    {stage.state.status === 'idle' && (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{stage.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                        <Clock className="h-3 w-3 mr-1" />
                        {statusText(stage.state)}
                        {stage.state.lastUpdated && ` · ${stage.state.lastUpdated}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {stage.state.status === 'success' ? stage.state.data.length : 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Rows Loaded</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
            <CardDescription>Jump straight to specific phase details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickNav.map((nav, idx) => (
                <Link key={idx} to={nav.href}>
                  <div className="group flex flex-col items-center justify-center rounded-lg border p-4 hover:bg-slate-50 transition-colors h-full">
                    <nav.icon className={`h-8 w-8 mb-2 ${nav.color}`} />
                    <span className="text-sm font-medium text-center">{nav.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
