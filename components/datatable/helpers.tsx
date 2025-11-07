import { BaseEntity } from ".";
import { ColumnDef } from "@tanstack/react-table";
import { DragHandle } from "./drag-handle";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { IconDotsVertical } from "@tabler/icons-react";
import React from "react";

/**
 * Creates a drag handle column for row reordering
 * @example
 * const columns = [
 *   createDragColumn<Product>(),
 *   ...otherColumns
 * ]
 */
export function createDragColumn<T extends BaseEntity>(): ColumnDef<T> {
  return {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  };
}

/**
 * Creates a checkbox selection column
 * @example
 * const columns = [
 *   createSelectColumn<Product>(),
 *   ...otherColumns
 * ]
 */
export function createSelectColumn<T extends BaseEntity>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

/**
 * Creates an actions dropdown column
 * @example
 * const columns = [
 *   ...otherColumns,
 *   createActionsColumn<Product>([
 *     { label: "Edit", onClick: (item) => editProduct(item) },
 *     { label: "Delete", onClick: (item) => deleteProduct(item), variant: "destructive" }
 *   ])
 * ]
 */
export function createActionsColumn<T extends BaseEntity>(
  actions?: {
    label: string | ((item: T) => React.ReactNode);
    onClick: (item: T) => void;
    variant?: "default" | "destructive";
  }[]
): ColumnDef<T> {
  return {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          {actions?.map((action, index) => (
            <React.Fragment key={index}>
              {index > 0 && action.variant === "destructive" && (
                <DropdownMenuSeparator />
              )}
              <DropdownMenuItem
                variant={action.variant}
                onClick={() => action.onClick(row.original)}
              >
                {typeof action.label === "function" ? action.label(row.original) : action.label}
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  };
}
