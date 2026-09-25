import { PageHeader } from "@/components/common/PageHeader";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and export pipeline output reports."
      />
      <PlaceholderCard
        title="Report Generation"
        description="Export field, GPS, and mission reports."
      />
    </div>
  );
}
