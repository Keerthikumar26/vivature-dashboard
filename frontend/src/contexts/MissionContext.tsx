import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../services/api';

interface MissionContextType {
  currentMission: string | null;
  missions: string[];
  setMission: (missionId: string) => void;
  loading: boolean;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export function MissionProvider({ children }: { children: ReactNode }) {
  const [currentMission, setCurrentMission] = useState<string | null>(null);
  const [missions, setMissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMissions() {
      try {
        const response = await apiClient.get('/missions');
        const missionList = response.data;
        setMissions(missionList);
        
        if (missionList.length > 0) {
          setCurrentMission(missionList[0]);
        }
      } catch (error) {
        console.error("Failed to fetch missions:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMissions();
  }, []);

  const setMission = (missionId: string) => {
    setCurrentMission(missionId);
  };

  return (
    <MissionContext.Provider value={{ currentMission, missions, setMission, loading }}>
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const context = useContext(MissionContext);
  if (context === undefined) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
}
