import apiClient from './index'
import { Phase1Data } from '@/types'

export const Phase1Service = {
  getData: async (missionId?: string | null): Promise<Phase1Data[]> => {
    const url = missionId ? `/phase1?mission_id=${missionId}` : '/phase1'; const response = await apiClient.get(url)
    if (!Array.isArray(response.data)) return []
    return response.data.map((item: any) => ({
      ...item,
      grid_id: item.Grid_ID || item.grid_id,
      ndvi: item.Average_NDVI || item.ndvi,
      avg_ndvi: item.Average_NDVI || item.avg_ndvi,
      ndre: item.Average_NDRE || item.ndre,
      avg_ndre: item.Average_NDRE || item.avg_ndre,
      vegetation_ratio: item.Vegetation_Ratio || item.vegetation_ratio,
      health_classification: item.Status || item.health_classification || 'Unknown',
      severity_level: item.Severity || item.severity_level || (item.Crop_Stress_Indicator > 50 ? 'Severe' : (item.Crop_Stress_Indicator > 20 ? 'Moderate' : 'Low'))
    }))
  }
}


