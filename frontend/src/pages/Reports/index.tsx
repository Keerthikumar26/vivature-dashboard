import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileText, FileSpreadsheet, Map as MapIcon, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Phase1Service } from '@/services/api/phase1Service'
import { Phase4Service } from '@/services/api/phase4Service'
import { Phase5Service } from '@/services/api/phase5Service'
import { Phase6Service } from '@/services/api/phase6Service'
import { calcMean } from '@/utils/statistics'
import { calculateTotalDistance } from '@/utils/geometry'

import { jsPDF } from 'jspdf'

export default function Reports() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const showMsg = (text: string, success = true) => {
    setMessage(text)
    setIsSuccess(success)
  }

  // ── CSV export ──────────────────────────────────────────────────────────────
  const exportCSV = (data: any[], filename: string) => {
    if (!data || !data.length) {
      showMsg('No data to export for ' + filename, false)
      return
    }
    const headers = Object.keys(data[0]).join(',')
    const rows = data
      .map(obj =>
        Object.values(obj)
          .map(v =>
            typeof v === 'string'
              ? '"' + v.replace(/"/g, '""') + '"'
              : String(v ?? '')
          )
          .join(',')
      )
      .join('\n')
    const csv = headers + '\n' + rows
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    showMsg('Exported ' + filename + ' successfully.')
  }

  // ── PDF summary ─────────────────────────────────────────────────────────────
  const exportDashboardSummaryPDF = async () => {
    if (!jsPDF) {
      showMsg('jsPDF is not installed. Run "npm install" in the frontend folder then restart the dev server.', false)
      return
    }
    setLoading(true)
    showMsg('Generating Dashboard Summary PDF...')
    try {
      const [p1, p4, p5] = await Promise.all([
        Phase1Service.getData(),
        Phase4Service.getData(),
        Phase5Service.getData(),
      ])

      const doc = new jsPDF()
      doc.setFontSize(22)
      doc.text('Vivature Dashboard - System Summary', 14, 20)

      doc.setFontSize(14)
      doc.text('Crop Health Analysis', 14, 38)
      doc.setFontSize(11)
      doc.text('Total Field Grids: ' + String(p1.length), 14, 46)
      const ndviMean = calcMean(p1, 'avg_ndvi') || calcMean(p1, 'ndvi')
      doc.text('Average NDVI: ' + ndviMean.toFixed(3), 14, 52)

      doc.setFontSize(14)
      doc.text('Flight Path Metrics', 14, 66)
      doc.setFontSize(11)
      const dist = calculateTotalDistance(p4, 'lat', 'lon')
      doc.text('Total Waypoints: ' + String(p4.length), 14, 74)
      doc.text('Total Flight Distance: ' + dist.toFixed(2) + ' m', 14, 80)

      doc.setFontSize(14)
      doc.text('Spray Mission Summary', 14, 94)
      doc.setFontSize(11)
      const vol = p5.reduce((sum, d) => sum + (0.2 * ((Number(d.spray_rate) || 0) / 100) * (Number(d.duration) || 0)), 0)
      doc.text('Total Spray Points: ' + String(p5.length), 14, 102)
      doc.text('Total Spray Volume: ' + vol.toFixed(2) + ' L', 14, 108)

      doc.save('Vivature_Dashboard_Summary.pdf')
      showMsg('Dashboard Summary PDF generated successfully.')
    } catch (err: any) {
      showMsg('Failed to generate PDF: ' + String(err?.message ?? 'unknown error'), false)
    } finally {
      setLoading(false)
    }
  }

  // ── Phase 1 CSV ─────────────────────────────────────────────────────────────
  const exportPhaseReportCSV = async () => {
    setLoading(true)
    showMsg('Fetching Phase 1 Data...')
    try {
      const data = await Phase1Service.getData()
      exportCSV(data, 'Phase1_CropHealth_Report.csv')
    } catch (err: any) {
      showMsg('Failed to fetch Phase 1 data: ' + String(err?.message ?? 'unknown error'), false)
    } finally {
      setLoading(false)
    }
  }

  // ── QGC mission download ────────────────────────────────────────────────────
  const downloadMissionRaw = () => {
    Phase6Service.downloadMission()
    showMsg('Mission waypoints file download started.')
  }

  return (
    <div className="space-y-6 pb-10">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Reports &amp; Exports</h2>
        <p className="text-slate-500 mt-1">Generate automated PDF summaries and raw CSV data exports.</p>
      </header>

      {message && (
        <div
          className={`px-4 py-3 rounded flex items-center text-sm border ${
            isSuccess
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {isSuccess
            ? <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
            : <AlertCircle  className="w-5 h-5 mr-2 flex-shrink-0" />
          }
          {message}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" /> Dashboard Summary
            </CardTitle>
            <CardDescription>Comprehensive system overview in PDF format covering all phases.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={exportDashboardSummaryPDF} disabled={loading} className="w-full">
              <Download className="mr-2 h-4 w-4" /> Generate PDF
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" /> Phase 1 Data
            </CardTitle>
            <CardDescription>Raw CSV export of the Crop Health Analysis (field_report.csv).</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={exportPhaseReportCSV} disabled={loading} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapIcon className="w-5 h-5" /> QGC Mission
            </CardTitle>
            <CardDescription>Download the original mission.waypoints file for UAV ground control software.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={downloadMissionRaw} variant="secondary" className="w-full">
              <Download className="mr-2 h-4 w-4" /> Download Waypoints
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

