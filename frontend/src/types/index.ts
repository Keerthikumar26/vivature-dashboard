export * from './phase1';
export * from './phase2';
export * from './phase3';
export * from './phase4';
export * from './phase5';
export * from './phase6';

export interface Phase7Data {
  mission_id: string;
  timestamp: string;
  crop_health_summary: {
    overall_health_score: number;
    health_status: string;
    stress_percentage: number;
    average_ndvi: number;
  };
  yield_risk_assessment: {
    severity: string;
    description: string;
  };
  actionable_recommendations: {
    type: string;
    priority: string;
    message: string;
  }[];
}
