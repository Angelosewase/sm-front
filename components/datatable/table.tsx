import { BaseEntity, DataTableProps } from ".";
import { Input } from "../ui/input";
import { IconSearch } from "@tabler/icons-react";
import { useState, useMemo, useEffect, useId } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { IconDotsVertical } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DraggableRow } from "./draggable-row";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { PaginationControls } from "./pagination-controls";
import { Tabs, TabsContent } from "../ui/tabs";
import { TabNavigation } from "./tab-navigation";
import { ColumnVisibilityDropdown } from "./column-visibility-dropdown";
import { TableToolbar } from "./table-toolbar";

export function DataTable<T extends BaseEntity>({
  data: initialData,
  columns,
  config = {},
  tabs = [],
  defaultTab,
  onDataChange,
  onAddClick,
  addButtonLabel,
  columnVisibilityLabel,
  customToolbarActions,
  onSelectionChange,
  getRowId,
  onTabChange,
}: DataTableProps<T>) {
  // Destructure config with defaults
  const {
    enableDragDrop = true,
    enableSelection = true,
    enableColumnVisibility = true,
    enablePagination = true,
    pageSize = 10,
    pageSizeOptions = [10, 20, 30, 40, 50],
  } = config;

  // State management
  const [data, setData] = useState<T[]>(initialData);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  // DnD setup
  const sortableId = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map((row) => getRowId ? getRowId(row) : (row.id || row._id || '')) || [],
    [data, getRowId]
  );

  // Notify parent of data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(data);
    }
  }, [data, onDataChange]);

 

  // Initialize table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
    getRowId: getRowId ? getRowId : (row) => (row.id || row._id)?.toString() || '',
    enableRowSelection: enableSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange]);

  // Handle drag end event
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  // Render table structure
  const renderTable = () => (
    <>
      <div className="overflow-hidden rounded-lg border">
        {enableDragDrop ? (
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow
                        key={row.id}
                        row={row}
                        enableDragDrop={enableDragDrop}
                      />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        ) : (
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table
                  .getRowModel()
                  .rows.map((row) => (
                    <DraggableRow
                      key={row.id}
                      row={row}
                      enableDragDrop={enableDragDrop}
                    />
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      {enablePagination && (
        <PaginationControls
          table={table}
          showRowsPerPage={true}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </>
  );

  // Render with tabs
  if (tabs.length > 0) {
    return (
      <Tabs
        defaultValue={defaultTab || tabs[0]?.value}
        className="w-full flex-col justify-start gap-4"
      >
        <div className="flex items-center justify-between px-4 lg:px-6">
          <TabNavigation tabs={tabs} defaultTab={defaultTab} />
          <div className="flex items-center gap-2">
            <div className="relative">
              <IconSearch className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-8 w-[200px] lg:w-[300px]"
              />
            </div>
            {enableColumnVisibility && (
              <ColumnVisibilityDropdown
                table={table}
                buttonLabel={columnVisibilityLabel}
              />
            )}
            <TableToolbar
              onAddClick={onAddClick}
              addButtonLabel={addButtonLabel}
              customActions={customToolbarActions}
            />
          </div>
        </div>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
          >
            {tab.content || renderTable()}
          </TabsContent>
        ))}
      </Tabs>
    );
  }

  // Render without tabs
  return (
    <div className="w-full flex-col justify-start gap-4">
      <div className="flex items-center justify-between px-4 lg:px-6 mb-6">
        <div className="relative">
          <IconSearch className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8 w-[200px] lg:w-[300px]"
          />
        </div>
        <div className="flex items-center gap-2">
          {enableColumnVisibility && (
            <ColumnVisibilityDropdown
              table={table}
              buttonLabel={columnVisibilityLabel}
            />
          )}
          <TableToolbar
            onAddClick={onAddClick}
            addButtonLabel={addButtonLabel}
            customActions={customToolbarActions}
          />
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        {renderTable()}
      </div>
    </div>
  );
}
