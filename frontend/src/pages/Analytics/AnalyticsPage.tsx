import { PageHeader } from "@/components/common/PageHeader";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Cross-phase analytics and performance metrics."
      />
      <PlaceholderCard
        title="Analytics Overview"
        description="Aggregated insights from all pipeline phases."
      />
    </div>
  );
}
