import apiClient from './index'
import { Phase5Data } from '@/types'

export const Phase5Service = {
  getData: async (missionId?: string | null): Promise<Phase5Data[]> => {
    const url = missionId ? `/phase5?mission_id=${missionId}` : '/phase5'; const response = await apiClient.get(url)
    if (!Array.isArray(response.data)) return []
    return response.data.map((item: any, index: number) => ({
      ...item,
      sequence: item.Sequence || index + 1,
      lat: item.Latitude || item.lat,
      lon: item.Longitude || item.lon,
      alt: item.Altitude || item.alt || 5,
      spray_rate: item.Spray_Rate || item.spray_rate || 0,
      flow_rate: item.Flow_Rate || item.flow_rate || 0,
      pwm: item.Pump_PWM || item.pwm || 0,
      duration: item.Spray_Duration || item.duration || 0,
      target_zone: item.Zone_ID ? `Zone ${item.Zone_ID}` : (item.target_zone || 'Unknown')
    }))
  }
}


