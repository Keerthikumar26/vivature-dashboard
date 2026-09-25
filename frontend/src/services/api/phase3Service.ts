import apiClient from './index'
import { Phase3Data } from '@/types'

export const Phase3Service = {
  getData: async (missionId?: string | null): Promise<Phase3Data[]> => {
    const url = missionId ? `/phase3?mission_id=${missionId}` : '/phase3'; const response = await apiClient.get(url)
    if (!Array.isArray(response.data)) return []
    return response.data.map((item: any) => ({
      ...item,
      zone_id: item.Zone_ID || item.zone_id,
      grid_count: item.Grid_Count || item.grid_count || 0,
      avg_ndvi: item.Average_NDVI || item.avg_ndvi,
      severity: item.Severity || item.severity,
      area: item.Area || item.area || (item.Grid_Count ? item.Grid_Count * 100 : 0),
      center_lat: item.Center_Latitude || item.center_lat,
      center_lon: item.Center_Longitude || item.center_lon,
      lat: item.Center_Latitude || item.lat,
      lon: item.Center_Longitude || item.lon
    }))
  }
}


