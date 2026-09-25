import { PageHeader } from "@/components/common/PageHeader";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function Phase2Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Phase 2 – GPS Mapping"
        description="Geospatial mapping from field report producing gps_report.csv."
      />
      <PlaceholderCard
        title="GPS Mapping"
        description="Input: field_report.csv → Output: gps_report.csv"
      />
    </div>
  );
}
