import { PageHeader } from "@/components/common/PageHeader";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function Phase5Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Phase 5 – Spray Mission"
        description="Spray mission generation producing spray_mission.csv."
      />
      <PlaceholderCard
        title="Spray Mission Planning"
        description="Input: coverage_path.csv → Output: spray_mission.csv"
      />
    </div>
  );
}
