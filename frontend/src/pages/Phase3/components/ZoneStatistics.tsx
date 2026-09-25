import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface ZoneStatisticsProps {
  largestArea: number;
  smallestArea: number;
  avgArea: number;
  avgGridCount: number;
  maxNdvi: number;
  minNdvi: number;
}

export function ZoneStatistics({ largestArea, smallestArea, avgArea, avgGridCount, maxNdvi, minNdvi }: ZoneStatisticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics Panel</CardTitle>
        <CardDescription>Cluster insights</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm text-slate-500">Largest Zone</span>
          <span className="font-medium">{largestArea.toFixed(2)} m²</span>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm text-slate-500">Smallest Zone</span>
          <span className="font-medium">{smallestArea.toFixed(2)} m²</span>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm text-slate-500">Average Area</span>
          <span className="font-medium">{avgArea.toFixed(2)} m²</span>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm text-slate-500">Avg Grid Count</span>
          <span className="font-medium">{avgGridCount.toFixed(1)}</span>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-sm text-slate-500">Maximum NDVI</span>
          <span className="font-medium">{maxNdvi.toFixed(3)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">Minimum NDVI</span>
          <span className="font-medium">{minNdvi.toFixed(3)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
