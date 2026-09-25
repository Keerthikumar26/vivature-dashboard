import { PageHeader } from "@/components/common/PageHeader";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of all pipeline phases and mission status."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <PlaceholderCard
          title="Pipeline Status"
          description="Track progress across all six processing phases."
        />
        <PlaceholderCard
          title="Field Overview"
          description="Summary of current field analysis results."
        />
        <PlaceholderCard
          title="Mission Status"
          description="Latest UAV spray mission planning status."
        />
      </div>
    </div>
  );
}
