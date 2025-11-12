import StatCard, { IStatCardDataItem } from "@/components/stat-card";

// Sample teacher performance data over time
const performanceData = [
  {
    date: "Week 1",
    "Total Teachers": 9,
    "Active Teachers": 8,
    "Avg Student Load": 78,
    "Teacher Satisfaction": 85,
  },
  {
    date: "Week 2",
    "Total Teachers": 9,
    "Active Teachers": 9,
    "Avg Student Load": 80,
    "Teacher Satisfaction": 86,
  },
  {
    date: "Week 3",
    "Total Teachers": 10,
    "Active Teachers": 9,
    "Avg Student Load": 82,
    "Teacher Satisfaction": 87,
  },
  {
    date: "Week 4",
    "Total Teachers": 10,
    "Active Teachers": 9,
    "Avg Student Load": 81,
    "Teacher Satisfaction": 88,
  },
  {
    date: "Week 5",
    "Total Teachers": 10,
    "Active Teachers": 10,
    "Avg Student Load": 80,
    "Teacher Satisfaction": 89,
  },
  {
    date: "Week 6",
    "Total Teachers": 10,
    "Active Teachers": 10,
    "Avg Student Load": 79,
    "Teacher Satisfaction": 90,
  },
  {
    date: "Week 7",
    "Total Teachers": 10,
    "Active Teachers": 9,
    "Avg Student Load": 80,
    "Teacher Satisfaction": 91,
  },
  {
    date: "Week 8",
    "Total Teachers": 10,
    "Active Teachers": 9,
    "Avg Student Load": 80,
    "Teacher Satisfaction": 92,
  },
];

const teacherStats: Array<Omit<IStatCardDataItem, "data">> = [
  {
    name: "Total Teachers",
    value: "10",
    change: "+1",
    percentageChange: "+11.1%",
    changeType: "positive",
    dataKey: "Total Teachers",
  },
  {
    name: "Active Teachers",
    value: "9",
    change: "+1",
    percentageChange: "+12.5%",
    changeType: "positive",
    dataKey: "Active Teachers",
  },
  {
    name: "Avg Student Load",
    value: "80",
    change: "+2",
    percentageChange: "+2.6%",
    changeType: "positive",
    dataKey: "Avg Student Load",
  },
  {
    name: "Teacher Satisfaction",
    value: "92%",
    change: "+7%",
    percentageChange: "+8.2%",
    changeType: "positive",
    dataKey: "Teacher Satisfaction",
  },
];

export function TeacherStats() {
  return (
    <div className="flex items-center justify-center p-4 w-full">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {teacherStats.map((item, idx) => (
          <StatCard key={idx} data={performanceData} {...item} />
        ))}
      </dl>
    </div>
  );
}
