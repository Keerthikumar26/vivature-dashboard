import apiClient from './index'
import { Phase7Data } from '@/types'

export const Phase7Service = {
  getData: async (missionId?: string | null): Promise<Phase7Data> => {
    const url = missionId ? `/phase7?mission_id=${missionId}` : '/phase7';
    const response = await apiClient.get(url)
    return response.data
  }
}
