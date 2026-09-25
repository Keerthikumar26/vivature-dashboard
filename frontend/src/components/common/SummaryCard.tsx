import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  valueClassName?: string;
}

export function SummaryCard({ title, value, icon, subtitle, valueClassName = '' }: SummaryCardProps) {
  return (
    <Card className="group transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-1 hover:border-primary/20 border-slate-200/60 bg-white/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{title}</CardTitle>
        {icon && (
          <div className="text-slate-400 group-hover:text-primary transition-colors p-2 bg-slate-50 group-hover:bg-primary/10 rounded-full">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold tracking-tight text-slate-900 ${valueClassName}`}>
          {value}
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
