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

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    event: "New Student Enrolled",
    user: "John Doe",
    timestamp: "2 hours ago",
    type: "enrollment",
  },
  {
    id: 2,
    event: "Score Updated",
    user: "Math Class - Grade 10",
    timestamp: "4 hours ago",
    type: "score",
  },
  {
    id: 3,
    event: "Teacher Added",
    user: "Sarah Johnson",
    timestamp: "5 hours ago",
    type: "teacher",
  },
  {
    id: 4,
    event: "Class Created",
    user: "Physics - Grade 11",
    timestamp: "1 day ago",
    type: "class",
  },
  {
    id: 5,
    event: "Staff Member Added",
    user: "Mike Wilson",
    timestamp: "1 day ago",
    type: "staff",
  },
  {
    id: 6,
    event: "Student Graduated",
    user: "Emily Brown",
    timestamp: "2 days ago",
    type: "graduation",
  },
];

const getEventBadgeVariant = (type: string) => {
  switch (type) {
    case "enrollment":
      return "default";
    case "score":
      return "secondary";
    case "teacher":
      return "outline";
    case "class":
      return "default";
    case "staff":
      return "secondary";
    case "graduation":
      return "outline";
    default:
      return "default";
  }
};

export function RecentActivity() {
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
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>User/Details</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.id}</TableCell>
                <TableCell>
                  <Badge variant={getEventBadgeVariant(activity.type)}>
                    {activity.event}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {activity.user}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {activity.timestamp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
