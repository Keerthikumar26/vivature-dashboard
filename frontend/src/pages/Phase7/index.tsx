import { useState, useEffect } from 'react'
import { Brain, Activity, ShieldAlert, ListChecks, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react'
import { Phase7Service } from '@/services/api/phase7Service'
import { useMission } from '@/contexts/MissionContext'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { SummaryCard } from '@/components/common/SummaryCard'
import { MetricGrid } from '@/components/common/MetricGrid'
import { Phase7Data } from '@/types'

export default function Phase7() {
  const { currentMission } = useMission()
  const [data, setData] = useState<Phase7Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await Phase7Service.getData(currentMission)
        setData(result)
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Failed to fetch AI report')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [currentMission])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-slate-500">AI Agronomist is analyzing mission data...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center space-y-4">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-medium text-slate-900">Analysis Failed</h3>
          <p className="text-slate-500 max-w-sm">{error || 'No report found.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      <header>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Brain className="h-8 w-8 text-emerald-500" />
          Phase 7 - AI Agronomist Engine
        </h2>
        <p className="text-slate-500 mt-1">Intelligent crop insights and automated recommendations based on mission analytics.</p>
      </header>

      <MetricGrid>
        <SummaryCard 
          title="Overall Health Score" 
          value={data.crop_health_summary.overall_health_score + '/100'} 
          icon={<Activity className="h-4 w-4 text-emerald-500"/>} 
        />
        <SummaryCard 
          title="Field Stress" 
          value={data.crop_health_summary.stress_percentage + '%'} 
          icon={<AlertTriangle className="h-4 w-4 text-amber-500"/>} 
        />
        <SummaryCard 
          title="Yield Risk" 
          value={data.yield_risk_assessment.severity} 
          icon={<ShieldAlert className="h-4 w-4 text-red-500"/>} 
        />
        <SummaryCard 
          title="Avg NDVI" 
          value={data.crop_health_summary.average_ndvi} 
        />
      </MetricGrid>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-500" />
              Crop Health Summary
            </CardTitle>
            <CardDescription>Synthesized overview of vegetative health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-medium text-slate-700">Health Status</span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                {data.crop_health_summary.health_status}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-medium text-slate-700">Stress Percentage</span>
              <span className="text-slate-900 font-bold">{data.crop_health_summary.stress_percentage}%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-medium text-slate-700">Average NDVI</span>
              <span className="text-slate-900 font-bold">{data.crop_health_summary.average_ndvi}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-amber-500" />
              Yield Risk Assessment
            </CardTitle>
            <CardDescription>Estimated impact on overall crop yield</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg h-full">
              <h4 className="font-semibold text-amber-900 mb-2">Severity: {data.yield_risk_assessment.severity}</h4>
              <p className="text-amber-800 leading-relaxed">
                {data.yield_risk_assessment.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-blue-500" />
            Actionable Recommendations
          </CardTitle>
          <CardDescription>AI-generated tasks based on current field conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.actionable_recommendations.map((rec, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="mt-1">
                  {rec.priority === 'Critical' ? (
                    <AlertOctagon className="h-5 w-5 text-red-500" />
                  ) : rec.priority === 'High' ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-slate-900">{rec.type}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{rec.message}</p>
                </div>
              </div>
            ))}
            {data.actionable_recommendations.length === 0 && (
              <p className="text-slate-500 italic">No critical actions required at this time.</p>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
