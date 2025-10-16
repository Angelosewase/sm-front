import { TabConfig } from ".";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TabsList, TabsTrigger } from "../ui/tabs";

interface TabNavigationProps {
  tabs: TabConfig[];
  defaultTab?: string;
}

export function TabNavigation({ tabs, defaultTab }: TabNavigationProps) {
  return (
    <>
      <Label htmlFor="view-selector" className="sr-only">
        View
      </Label>
      {/* Mobile dropdown */}
      <Select defaultValue={defaultTab || tabs[0]?.value}>
        <SelectTrigger
          className="flex w-fit @4xl/main:hidden"
          size="sm"
          id="view-selector"
        >
          <SelectValue placeholder="Select a view" />
        </SelectTrigger>
        <SelectContent>
          {tabs.map((tab) => (
            <SelectItem key={tab.value} value={tab.value}>
              {tab.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Desktop tabs */}
      <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
            {tab.badge !== undefined && (
              <Badge variant="secondary">{tab.badge}</Badge>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </>
  );
}
