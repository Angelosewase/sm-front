import { BaseEntity } from ".";
import { Row } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableCell, TableRow } from "../ui/table";
import { flexRender } from "@tanstack/react-table";

interface DraggableRowProps<T extends BaseEntity> {
  row: Row<T>;
  enableDragDrop: boolean;
}

export function DraggableRow<T extends BaseEntity>({
  row,
  enableDragDrop,
}: DraggableRowProps<T>) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  const rowProps = enableDragDrop
    ? {
        ref: setNodeRef,
        style: {
          transform: CSS.Transform.toString(transform),
          transition: transition,
        },
        "data-dragging": isDragging,
        className:
          "relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80",
      }
    : {};

  return (
    <TableRow data-state={row.getIsSelected() && "selected"} {...rowProps}>
      {row.getVisibleCells().map((cell: any) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
