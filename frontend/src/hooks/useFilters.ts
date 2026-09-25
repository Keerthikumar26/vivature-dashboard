import { useState, useMemo } from 'react';

export function useFilters(data: any[], searchKey?: string) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const setFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    let processed = [...data];
    if (searchTerm && searchKey) {
      processed = processed.filter(item => String(item[searchKey]).toLowerCase().includes(searchTerm.toLowerCase()));
    }
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        processed = processed.filter(item => String(item[key]) === String(filters[key]));
      }
    });
    if (sortConfig !== null) {
      processed.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return processed;
  }, [data, searchTerm, searchKey, filters, sortConfig]);

  return { searchTerm, setSearchTerm, filters, setFilter, sortConfig, handleSort, filteredData };
}
