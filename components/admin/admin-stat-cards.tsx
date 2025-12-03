'use client'
import StatCard, { IStatCardDataItem } from "../stat-card";
import { useSchool } from "@/contexts/school-context";
import { useAdminAnalytics } from "@/hooks/use-analytics";
import { Skeleton } from "../ui/skeleton";



export function AdminStatCards() {
  const { school } = useSchool();
  const schoolId = school?.id;

  const { data, isLoading, isError, cards, series } = useAdminAnalytics(schoolId);

  const dataSeries = series ?? [];
  const items: Array<Omit<IStatCardDataItem, "data">> = cards ?? [];

  return (
    <div className="w-full">
       {isLoading ? (
        <>
          <div className="flex items-center justify-center p-4 w-full">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
          <div className="px-4">
            <Skeleton className="h-96 w-full" />
          </div>
        </>
      ) : (
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {items.map((item, idx) => (
          <StatCard key={idx} data={dataSeries} {...item} />
        ))}
      </dl>
      )}
    </div>
  );
}
