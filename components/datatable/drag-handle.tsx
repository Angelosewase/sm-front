"use client";

import { useSortable } from "@dnd-kit/sortable";
import { Button } from "../ui/button";
import { IconGripVertical } from "@tabler/icons-react";

interface DragHandleProps {
  id: number | string;
  disabled?: boolean;
}

export function DragHandle({ id, disabled = false }: DragHandleProps) {
  const { attributes, listeners } = useSortable({ id });

  if (disabled) return null;

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}
