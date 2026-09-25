import { PageHeader } from "@/components/common/PageHeader";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function Phase3Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Phase 3 – Stress Zones"
        description="Stress zone identification producing spray_zones.csv."
      />
      <PlaceholderCard
        title="Stress Zone Analysis"
        description="Input: gps_report.csv → Output: spray_zones.csv"
      />
    </div>
  );
}
