import apiClient from './index'
import { Phase4Data } from '@/types'

export const Phase4Service = {
  getData: async (missionId?: string | null): Promise<Phase4Data[]> => {
    const url = missionId ? `/phase4?mission_id=${missionId}` : '/phase4'; const response = await apiClient.get(url)
    if (!Array.isArray(response.data)) return []
    return response.data.map((item: any, index: number) => ({
      ...item,
      sequence: item.Sequence || index + 1,
      lat: item.Latitude || item.lat,
      lon: item.Longitude || item.lon,
      alt: item.Altitude || item.alt || 5,
      path_type: item.Path_Type || item.path_type || 'Coverage'
    }))
  }
}


