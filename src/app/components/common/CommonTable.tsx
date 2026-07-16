import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode, useState, useMemo, useEffect, useRef } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export interface ColumnDef<T = any> {
  key: string;
  header: string | ReactNode;
  width?: string;
  minWidth?: string;
  sticky?: 'left' | 'right';
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => ReactNode;
}

export interface PaginationConfig {
  enabled: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
}

export interface CommonTableProps<T = any> {
  data: T[];
  columns: ColumnDef<T>[];
  rowKey?: (row: T) => string;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  pagination?: PaginationConfig;
  maxHeight?: string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  noTopRadius?: boolean;
  noShadow?: boolean;
  borderTopOnly?: boolean;
}

const checkboxBgUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgNEw0LjUgNy41TDExIDEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+";

export function CommonTable<T extends Record<string, any>>({
  data,
  columns,
  rowKey,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  pagination,
  maxHeight = 'calc(100vh - 100px)',
  emptyMessage = 'Không có dữ liệu',
  onRowClick,
  noTopRadius = false,
  noShadow = false,
  borderTopOnly = false,
}: CommonTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pagination?.defaultPageSize || 20);
  const tableRef = useRef<HTMLDivElement>(null);

  // Default rowKey function if not provided
  const getRowKey = rowKey || ((row: T, index: number) => row.id || String(index));

  // Calculate pagination
  const totalItems = data.length;
  const isShowingAll = pageSize === -1;
  const totalPages = pagination?.enabled && !isShowingAll ? Math.ceil(totalItems / pageSize) : 1;
  const startIndex = pagination?.enabled && !isShowingAll ? (currentPage - 1) * pageSize : 0;
  const endIndex = pagination?.enabled && !isShowingAll ? Math.min(startIndex + pageSize, totalItems) : totalItems;
  const paginatedData = pagination?.enabled && !isShowingAll ? data.slice(startIndex, endIndex) : data;

  // Prepare columns - simple approach without offset calculation
  const columnsWithMetadata = useMemo(() => {
    // Find last left sticky column for shadow
    let lastLeftIndex = -1;
    let firstRightIndex = -1;
    
    columns.forEach((column, index) => {
      if (column.sticky === 'left') {
        lastLeftIndex = index;
      }
      if (column.sticky === 'right' && firstRightIndex === -1) {
        firstRightIndex = index;
      }
    });

    return columns.map((column, index) => ({
      ...column,
      showShadow: (column.sticky === 'left' && index === lastLeftIndex) || 
                  (column.sticky === 'right' && index === firstRightIndex),
    }));
  }, [columns]);

  // Calculate sticky positions dynamically after render
  useEffect(() => {
    if (!tableRef.current) return;

    const headerRow = tableRef.current.querySelector('thead tr');
    if (!headerRow) return;

    const headers = Array.from(headerRow.querySelectorAll('th'));
    let leftOffset = 0;
    
    // If selectable, first column is checkbox
    if (selectable && headers.length > 0) {
      const checkboxHeader = headers[0];
      leftOffset = checkboxHeader.offsetWidth;
    }

    // Calculate left sticky offsets
    headers.forEach((header, index) => {
      const colIndex = selectable ? index - 1 : index;
      if (colIndex < 0) return; // Skip checkbox column
      
      const column = columnsWithMetadata[colIndex];
      if (column?.sticky === 'left') {
        // Set left position
        header.style.left = `${leftOffset}px`;
        
        // Apply to all body cells in this column
        const bodyRows = tableRef.current?.querySelectorAll('tbody tr');
        bodyRows?.forEach(row => {
          const cell = row.children[index] as HTMLElement;
          if (cell) {
            cell.style.left = `${leftOffset}px`;
          }
        });
        
        leftOffset += header.offsetWidth;
      }
    });

    // Calculate right sticky offsets
    let rightOffset = 0;
    for (let i = headers.length - 1; i >= 0; i--) {
      const header = headers[i];
      const colIndex = selectable ? i - 1 : i;
      if (colIndex < 0) continue;
      
      const column = columnsWithMetadata[colIndex];
      if (column?.sticky === 'right') {
        // Set right position
        header.style.right = `${rightOffset}px`;
        
        // Apply to all body cells in this column
        const bodyRows = tableRef.current?.querySelectorAll('tbody tr');
        bodyRows?.forEach(row => {
          const cell = row.children[i] as HTMLElement;
          if (cell) {
            cell.style.right = `${rightOffset}px`;
          }
        });
        
        rightOffset += header.offsetWidth;
      }
    }
  }, [columns, columnsWithMetadata, paginatedData, selectable]);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      const allIds = paginatedData.map((row, index) => getRowKey(row, index));
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedRows, id]);
    } else {
      onSelectionChange(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every((row, index) => selectedRows.includes(getRowKey(row, index)));
  const isSomeSelected = paginatedData.some((row, index) => selectedRows.includes(getRowKey(row, index))) && !isAllSelected;

  return (
    <div className={`flex-1 h-full bg-table ${borderTopOnly ? 'border-t' : 'border'} border-table ${noShadow ? '' : 'shadow-sm'} flex flex-col overflow-hidden ${noTopRadius ? 'rounded-b-lg' : 'rounded-lg'}`}>
      {/* Dynamic CSS for sticky columns */}
      <style>{`
        .sticky-shadow-right {
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
        }
        .sticky-shadow-left {
          box-shadow: -2px 0 4px rgba(0, 0, 0, 0.05);
        }
      `}</style>
      
      {/* Table */}
      <div ref={tableRef} className="flex-1 overflow-auto" style={{ maxHeight }}>
        <table className="w-full border-collapse border-spacing-0">
          <thead 
            className="sticky top-0 z-10 border-b border-table bg-table-header"
          >
            <tr>
              {/* Checkbox Column */}
              {selectable && (
                <th 
                  className="px-4 py-2 text-left sticky left-0 z-20 w-[48px] bg-table-header"
                >
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
              )}

              {/* Data Columns */}
              {columnsWithMetadata.map((column, index) => {
                const stickyClass = column.sticky ? 'sticky z-10' : '';
                  
                return (
                  <th
                    key={`header-${column.key}`}
                    className={`py-2 px-3 whitespace-nowrap tracking-wider bg-table-header ${column.width || ''} ${column.minWidth || ''} ${
                      column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'
                    } ${stickyClass} ${
                      column.showShadow && column.sticky === 'left' ? 'sticky-shadow-right' : ''
                    } ${
                      column.showShadow && column.sticky === 'right' ? 'sticky-shadow-left' : ''
                    }`}
                  >
                    <h5 className="table-text-muted text-left">
                      {column.header}
                    </h5>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody 
            className="divide-y-table bg-table"
          >
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12 text-center table-text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const id = getRowKey(row, rowIndex);
                const isSelected = selectedRows.includes(id);
                const isEvenRow = rowIndex % 2 === 1; // Even index for striped pattern
                
                return (
                  <tr
                    key={id}
                    className={`group transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                    onMouseEnter={(e) => {
                      const allCells = e.currentTarget.querySelectorAll('td');
                      allCells.forEach((cell) => {
                        // Add hover class based on selection state
                        (cell as HTMLElement).classList.add(isSelected ? 'hover-primary-fill' : 'bg-table-hover');
                      });
                    }}
                    onMouseLeave={(e) => {
                      const allCells = e.currentTarget.querySelectorAll('td');
                      allCells.forEach((cell) => {
                        // Remove both hover classes
                        (cell as HTMLElement).classList.remove('bg-table-hover', 'hover-primary-fill');
                      });
                    }}
                    onClick={() => onRowClick?.(row)}
                  >
                    {/* Checkbox Cell */}
                    {selectable && (
                      <td
                        className={`pl-4 py-3 sticky left-0 z-5 transition-colors w-[48px] cursor-pointer pointer-events-auto ${
                          isSelected 
                            ? 'bg-[var(--primary-fill-light)]' 
                            : isEvenRow 
                              ? 'bg-table-second' 
                              : 'bg-table'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectRow(id, !isSelected);
                        }}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectRow(id, checked as boolean)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}

                    {/* Data Cells */}
                    {columnsWithMetadata.map((column, colIndex) => {
                      const stickyClass = column.sticky ? 'sticky z-5' : '';
                        
                      return (
                        <td
                          key={`cell-${id}-${column.key}`}
                          className={`py-2 px-3 transition-colors ${column.width || ''} ${column.minWidth || ''} ${
                            column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'
                          } ${stickyClass} ${
                            column.showShadow && column.sticky === 'left' ? 'sticky-shadow-right' : ''
                          } ${
                            column.showShadow && column.sticky === 'right' ? 'sticky-shadow-left' : ''
                          } ${
                            isSelected 
                              ? 'bg-[var(--primary-fill-light)]' 
                              : isEvenRow 
                                ? 'bg-table-second' 
                                : 'bg-table'
                          }`}
                        >
                          {column.render ? column.render(row) : (
                            <span className="text-sm table-text">
                              {row[column.key]}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-table bg-table-header">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap text-muted-foreground">
            {isShowingAll 
              ? `Từ 1 đến ${totalItems} trên tổng số ${totalItems} kết quả`
              : `Từ ${startIndex + 1} đến ${endIndex} trên tổng số ${totalItems} kết quả`
            }
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="min-w-[18px] px-1.5 py-1.5 border border-table transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[18px] flex items-center justify-center bg-table table-text rounded-md hover:bg-table-hover"
            disabled={currentPage === 1 || isShowingAll}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>

          {!isShowingAll && Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let pageNumber;
            if (totalPages <= 7) {
              pageNumber = i + 1;
            } else if (currentPage <= 4) {
              pageNumber = i + 1;
            } else if (currentPage >= totalPages - 3) {
              pageNumber = totalPages - 6 + i;
            } else {
              pageNumber = currentPage - 3 + i;
            }
            return pageNumber;
          }).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`min-w-[24px] px-3 py-1 border transition-colors text-sm rounded-md ${
                currentPage === page 
                  ? 'font-medium bg-primary text-primary-foreground border-primary' 
                  : 'font-normal bg-table table-text border-table hover:bg-table-hover'
              }`}
            >
              {page}
            </button>
          ))}

          {!isShowingAll && totalPages > 6 && (
            <span className="px-2 table-text-muted">...</span>
          )}

          {!isShowingAll && totalPages > 6 && currentPage < totalPages - 3 && (
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="min-w-[24px] px-3 py-1 border border-table bg-table table-text transition-colors text-sm rounded-md hover:bg-table-hover"
            >
              {totalPages}
            </button>
          )}

          <button
            className="min-w-[18px] px-1.5 py-1.5 border border-table bg-table table-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[18px] flex items-center justify-center rounded-md hover:bg-table-hover"
            disabled={currentPage === totalPages || isShowingAll}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>

          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger 
              className="w-[68px] px-2 h-7 border-table bg-table table-text rounded-md ml-2"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(pagination?.pageSizeOptions || [10, 20, 50, 100]).map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
              <SelectItem value="-1">
                All
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
