export interface BaseEntity {
  id: number | string;
  [key: string]: any;
}

export interface TabConfig {
  value: string;
  label: string;
  badge?: number;
  content?: React.ReactNode;
}

export interface DataTableConfig<T extends BaseEntity> {
  enableDragDrop?: boolean;
  enableSelection?: boolean;
  enableColumnVisibility?: boolean;
  enablePagination?: boolean;
  enableSearch?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
}

export interface TableToolbarProps {
  onAddClick?: () => void;
  addButtonLabel?: string;
  customActions?: React.ReactNode;
}

export interface DataTableProps<T extends BaseEntity> {
  data: T[];
  columns: ColumnDef<T>[];
  config?: DataTableConfig<T>;
  tabs?: TabConfig[];
  defaultTab?: string;
  onDataChange?: (data: T[]) => void;
  onAddClick?: () => void;
  addButtonLabel?: string;
  columnVisibilityLabel?: string;
  customToolbarActions?: React.ReactNode;
  onSelectionChange?: (selected: T[]) => void;
}
