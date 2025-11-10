import StatCard, { IStatCardDataItem } from "@/components/stat-card";

// Sample staff metrics data over time
const staffMetricsData = [
  {
    date: "Week 1",
    "Total Staff": 14,
    "Full-time": 11,
    "Part-time": 3,
    "Attendance Rate": 96,
  },
  {
    date: "Week 2",
    "Total Staff": 14,
    "Full-time": 11,
    "Part-time": 3,
    "Attendance Rate": 97,
  },
  {
    date: "Week 3",
    "Total Staff": 15,
    "Full-time": 12,
    "Part-time": 3,
    "Attendance Rate": 95,
  },
  {
    date: "Week 4",
    "Total Staff": 15,
    "Full-time": 12,
    "Part-time": 3,
    "Attendance Rate": 98,
  },
  {
    date: "Week 5",
    "Total Staff": 15,
    "Full-time": 12,
    "Part-time": 3,
    "Attendance Rate": 97,
  },
  {
    date: "Week 6",
    "Total Staff": 15,
    "Full-time": 12,
    "Part-time": 3,
    "Attendance Rate": 99,
  },
  {
    date: "Week 7",
    "Total Staff": 15,
    "Full-time": 12,
    "Part-time": 3,
    "Attendance Rate": 98,
  },
  {
    date: "Week 8",
    "Total Staff": 15,
    "Full-time": 12,
    "Part-time": 3,
    "Attendance Rate": 98,
  },
];

const staffStats: Array<Omit<IStatCardDataItem, "data">> = [
  {
    name: "Total Staff",
    value: "15",
    change: "+1",
    percentageChange: "+7.1%",
    changeType: "positive",
    dataKey: "Total Staff",
  },
  {
    name: "Full-time",
    value: "12",
    change: "+1",
    percentageChange: "+9.1%",
    changeType: "positive",
    dataKey: "Full-time",
  },
  {
    name: "Part-time",
    value: "3",
    change: "0",
    percentageChange: "0%",
    changeType: "neutral",
    dataKey: "Part-time",
  },
  {
    name: "Attendance Rate",
    value: "98%",
    change: "+2%",
    percentageChange: "+2.1%",
    changeType: "positive",
    dataKey: "Attendance Rate",
  },
];

const sanitizeName = (name: string) => {
  return name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "_")
    .toLowerCase();
};

export function StaffStats() {
  return (
    <div className="flex items-center justify-center p-4 w-full">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
      {staffStats.map((item, idx) => (
          <StatCard key={idx} data={staffMetricsData} {...item} />
        ))}
      </dl>
    </div>
  );
}
