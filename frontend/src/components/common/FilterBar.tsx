import React from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  label?: string;
  value: string;
  options: FilterOption[];
  onChange: (val: string) => void;
  defaultLabel?: string;
}

export function FilterBar({ label, value, options, onChange, defaultLabel = "All" }: FilterBarProps) {
  return (
    <select
      className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{defaultLabel}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
