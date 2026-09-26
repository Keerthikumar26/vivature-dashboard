import { Input } from '@/components/ui/input';

interface SearchBoxProps {
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
}

export function SearchBox({ placeholder = "Search...", value, onChange }: SearchBoxProps) {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-sm h-9"
    />
  );
}
