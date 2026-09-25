import apiClient from './index'
import { Phase2Data } from '@/types'

export const Phase2Service = {
  getData: async (missionId?: string | null): Promise<Phase2Data[]> => {
    const url = missionId ? `/phase2?mission_id=${missionId}` : '/phase2'; const response = await apiClient.get(url)
    if (!Array.isArray(response.data)) return []
    return response.data.map((item: any) => ({
      ...item,
      grid_id: item.Grid_ID || item.grid_id,
      lat: item.Latitude || item.lat,
      lon: item.Longitude || item.lon,
      ndvi: item.Average_NDVI || item.ndvi,
      ndre: item.Average_NDRE || item.ndre || 0,
      vegetation_ratio: item.Vegetation_Ratio || item.vegetation_ratio,
      health_classification: item.Status || item.health_classification || 'Unknown',
      severity_level: item.Severity || item.severity_level || (item.Average_NDVI < 0.4 ? 'Severe' : 'Low')
    }))
  }
}


