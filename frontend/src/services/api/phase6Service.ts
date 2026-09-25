import apiClient from './index'
import { Phase6Data } from '@/types'

export const Phase6Service = {
  getData: async (missionId?: string | null): Promise<Phase6Data[]> => {
    const url = missionId ? `/phase6?mission_id=${missionId}` : '/phase6'; const response = await apiClient.get(url, { responseType: 'text' })
    const text = response.data
    if (typeof text !== 'string') return Array.isArray(text) ? text : [];
    
    const lines = text.split('\n').map(l => l.trim()).filter(l => l)
    if (lines[0] !== 'QGC WPL 110') {
      // If it's not a standard QGC file, return empty or try JSON parsing
      try {
        const json = JSON.parse(text)
        return Array.isArray(json) ? json : []
      } catch (e) {
        return []
      }
    }
    
    const data: Phase6Data[] = []
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split('\t')
      if (parts.length >= 11) {
        data.push({
          waypoint: parseInt(parts[0]),
          current_wp: parseInt(parts[1]),
          frame: parseInt(parts[2]),
          command: parseInt(parts[3]),
          lat: parseFloat(parts[8]),
          lon: parseFloat(parts[9]),
          alt: parseFloat(parts[10]),
          autocontinue: parseInt(parts[11] || '1')
        })
      }
    }
    return data
  },
  
  downloadMission: async (missionId?: string | null) => {
    const apiUrl = missionId ? `/phase6?mission_id=${missionId}` : '/phase6'; 
    const response = await apiClient.get(apiUrl, { responseType: 'blob' })
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = blobUrl
    link.setAttribute('download', 'mission.waypoints')
    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link)
  }
}


