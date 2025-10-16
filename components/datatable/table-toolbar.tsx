import { TableToolbarProps } from ".";
import { Button } from "../ui/button";
import { IconPlus } from "@tabler/icons-react";

export function TableToolbar({
  onAddClick,
  addButtonLabel = "Add Item",
  customActions,
}: TableToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      {customActions}
      {onAddClick && (
        <Button variant="outline" size="sm" onClick={onAddClick}>
          <IconPlus />
          <span className="hidden lg:inline">{addButtonLabel}</span>
        </Button>
      )}
    </div>
  );
}
