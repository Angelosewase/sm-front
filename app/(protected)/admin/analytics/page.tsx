import React from "react";
import { Timer } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Timer className="h-40 w-40 text-muted-foreground" />
      <h1 className="text-2xl font-semibold mt-4">Comming soon !</h1>
      <p className="text-muted-foreground mt-2">
        We are working hard to provide you with the best possible experience.
      </p>
    </div>
  );
}
