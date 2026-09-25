import { PageHeader } from "@/components/common/PageHeader";
import { PlaceholderCard } from "@/components/common/PlaceholderCard";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure application and data source paths."
      />
      <PlaceholderCard
        title="Application Settings"
        description="Data directory, API configuration, and display preferences."
      />
    </div>
  );
}
