// b:\Work\sengel\sm-front\components\admin\recent-activity.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRecentEvents } from "@/hooks/use-events";
import { formatDistanceToNow } from "date-fns";

const getEventBadgeVariant = (eventType: string) => {
  switch (eventType) {
    case "create":
      return "default";
    case "update":
      return "secondary";
    case "delete":
      return "destructive";
    case "login":
      return "outline";
    case "logout":
      return "outline";
    default:
      return "default";
  }
};

export function RecentActivity() {
  const { data, isLoading, error } = useRecentEvents(5);

  if (isLoading) {
    return <div>Loading recent activities...</div>;
  }

  if (error) {
    return <div>Error loading activities</div>;
  }

  if (!data || data.events.length === 0) {
    return <div>No recent activities found</div>;
  }


  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest events and updates</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <Badge variant={getEventBadgeVariant(event.eventType)}>
                    {event.eventType}
                  </Badge>
                </TableCell>
                <TableCell>{event.details}</TableCell>
                <TableCell className="text-right">
                  {formatDistanceToNow(new Date(event.occurredAt), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}