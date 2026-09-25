import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import React from 'react';

interface StatItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface StatisticsCardProps {
  title: string;
  description?: string;
  items: StatItem[];
}

export function StatisticsCard({ title, description, items }: StatisticsCardProps) {
  return (
    <Card className="group transition-all duration-300 hover:shadow-md border-slate-200/60 bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight text-slate-800">{title}</CardTitle>
        {description && <CardDescription className="text-slate-500">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors">
            <span className="text-sm text-slate-500 flex items-center font-medium">
              {item.icon && <span className="mr-2 text-slate-400 group-hover:text-primary/70 transition-colors">{item.icon}</span>}
              {item.label}
            </span>
            <span className="font-semibold text-slate-900">{item.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
