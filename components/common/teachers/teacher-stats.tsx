import StatCard, { IStatCardDataItem } from "@/components/stat-card";
import { useTeacherStats } from "@/hooks/use-analytics";

export function TeacherStats({ schoolId }: { schoolId?: string }) {
  const { data, isLoading, isError } = useTeacherStats(schoolId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 w-full">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-24 w-full animate-pulse rounded-md bg-muted"
            />
          ))}
        </dl>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center p-4 w-full text-sm text-muted-foreground">
        Failed to load teacher statistics.
      </div>
    );
  }

  const cards = data.cards as Array<Omit<IStatCardDataItem, "data">>;
  const series = data.series;

  return (
    <div className="flex items-center justify-center p-4 w-full">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {cards.map((item, idx) => (
          <StatCard key={item.dataKey ?? idx} data={series} {...item} />
        ))}
      </dl>
    </div>
  );
}
