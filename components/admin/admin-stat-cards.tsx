'use client'
import StatCard, { IStatCardDataItem } from "../stat-card";
import { useSchool } from "@/contexts/school-context";
import { useAdminAnalytics } from "@/hooks/use-analytics";

// Fallback sample admin metrics data over time
const fallbackMetricsData = [
  {
    date: "Week 1",
    "Total Students": 1180,
    Teachers: 56,
    Classes: 30,
    "Staff Members": 15,
  },
  {
    date: "Week 2",
    "Total Students": 1195,
    Teachers: 57,
    Classes: 31,
    "Staff Members": 16,
  },
  {
    date: "Week 3",
    "Total Students": 1210,
    Teachers: 57,
    Classes: 31,
    "Staff Members": 16,
  },
  {
    date: "Week 4",
    "Total Students": 1225,
    Teachers: 58,
    Classes: 32,
    "Staff Members": 17,
  },
  {
    date: "Week 5",
    "Total Students": 1230,
    Teachers: 58,
    Classes: 32,
    "Staff Members": 17,
  },
  {
    date: "Week 6",
    "Total Students": 1240,
    Teachers: 58,
    Classes: 32,
    "Staff Members": 17,
  },
  {
    date: "Week 7",
    "Total Students": 1245,
    Teachers: 58,
    Classes: 32,
    "Staff Members": 17,
  },
];

const fallbackCards: Array<Omit<IStatCardDataItem, "data">> = [
  {
    name: "Total Students",
    icon: "🧍‍♂️",
    value: "1,245",
    change: "+65",
    percentageChange: "+5%",
    changeType: "positive",
    dataKey: "Total Students",
  },
  {
    name: "Teachers",
    icon: "🎓",
    value: "58",
    change: "-1",
    percentageChange: "-2%",
    changeType: "negative",
    dataKey: "Teachers",
  },
  {
    name: "Classes",
    icon: "🏫",
    value: "32",
    change: "+2",
    percentageChange: "+1%",
    changeType: "positive",
    dataKey: "Classes",
  },
  {
    name: "Staff Members",
    icon: "👨‍🔧",
    value: "17",
    change: "+2",
    percentageChange: "+3%",
    changeType: "positive",
    dataKey: "Staff Members",
  },
];

export function AdminStatCards() {
  const { school } = useSchool();
  const schoolId = school?.id;

  const { data, isLoading, isError, cards, series } = useAdminAnalytics(schoolId);


  const dataSeries = series ?? fallbackMetricsData;
  const items: Array<Omit<IStatCardDataItem, "data">> = cards ?? fallbackCards;

  return (
    <div className="w-full">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {items.map((item, idx) => (
          <StatCard key={idx} data={dataSeries} {...item} />
        ))}
      </dl>
    </div>
  );
}
