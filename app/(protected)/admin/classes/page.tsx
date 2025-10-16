import React from "react";
import data from "@/data.json";
import { DataTable } from "@/components/datatable/data-table";
import Stats10 from "@/components/cards/stat-cards-graph";
import { Button } from "@/components/ui/button";

export default function AdminClassesPage() {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-3xl font-semibold text-primary">
          Organize your  classes
        </h2>
        <Button variant="outline" className="mr-4">Add class</Button>
      </div>
      <Stats10 />
      <DataTable data={data} />
    </div>
  );
}
