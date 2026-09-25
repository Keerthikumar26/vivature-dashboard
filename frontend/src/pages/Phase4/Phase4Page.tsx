import { PageHeader } from "@/components/common/PageHeader";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function Phase4Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Phase 4 – Coverage Path"
        description="Optimal coverage path planning producing coverage_path.csv."
      />
      <PlaceholderCard
        title="Coverage Path Planning"
        description="Input: spray_zones.csv → Output: coverage_path.csv"
      />
    </div>
  );
}
