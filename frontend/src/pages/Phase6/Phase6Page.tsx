import { PageHeader } from "@/components/common/PageHeader";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function Phase6Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Phase 6 – Mission Planner"
        description="Final mission waypoint generation producing mission.waypoints."
      />
      <PlaceholderCard
        title="Mission Waypoint Planner"
        description="Input: spray_mission.csv → Output: mission.waypoints"
      />
    </div>
  );
}
