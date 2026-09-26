import { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Pagination } from './Pagination'
import { SearchBox } from './SearchBox'

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  searchKey?: string;
  filters?: {
    [key: string]: string | null;
  };
}

export function DataTable({ data, columns, searchKey, filters }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc'
    setSortConfig({ key, direction })
  }

  const filteredData = useMemo(() => {
    let processed = [...data]
    if (searchTerm && searchKey) {
      processed = processed.filter(item => String(item[searchKey]).toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          processed = processed.filter(item => String(item[key]) === String(filters[key]))
        }
      })
    }
    if (sortConfig !== null) {
      processed.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return processed
  }, [data, searchTerm, searchKey, filters, sortConfig])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredData.slice(start, start + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        {searchKey && (
          <SearchBox
            placeholder={`Search by ${searchKey}...`}
            value={searchTerm}
            onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          />
        )}
      </div>

      <div className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-sm overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200/60">
            <TableRow className="hover:bg-transparent border-none">
              {columns.map(col => (
                <TableHead 
                  key={col.key} 
                  className={col.sortable ? "cursor-pointer select-none hover:text-slate-900 transition-colors" : ""}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    {col.sortable && sortConfig?.key === col.key && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <TableRow key={i} className="transition-colors hover:bg-slate-50/80 border-slate-100">
                  {columns.map(col => (
                    <TableCell key={col.key} className="py-3">
                      {typeof row[col.key] === 'number'
                        ? (!Number.isInteger(row[col.key]) ? row[col.key].toFixed(3) : row[col.key])
                        : (row[col.key] != null && row[col.key] !== '' ? row[col.key] : 'N/A')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
