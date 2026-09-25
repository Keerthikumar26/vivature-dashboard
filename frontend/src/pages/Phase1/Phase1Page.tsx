import { PageHeader } from "@/components/common/PageHeader";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function Phase1Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Phase 1 – Crop Health"
        description="Multispectral image analysis producing field_report.csv."
      />
      <PlaceholderCard
        title="Crop Health Analysis"
        description="Input: Multispectral Image → Output: field_report.csv"
      />
    </div>
  );
}
