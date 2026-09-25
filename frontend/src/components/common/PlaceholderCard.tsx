import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlaceholderCardProps {
  title: string;
  description: string;
}

export function PlaceholderCard({ title, description }: PlaceholderCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-muted-foreground/25 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            Content will be displayed here
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
