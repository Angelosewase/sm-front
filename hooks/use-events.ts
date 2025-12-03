// b:\Work\Work\sengel\sm-front\hooks\use-events.ts
import { useQuery } from "@tanstack/react-query";
import { eventsApi, PaginatedEvents } from "@/lib/api/events";

export const eventsKeys = {
  all: ["events"] as const,
  recent: () => [...eventsKeys.all, "recent"] as const,
};

export function useRecentEvents(limit: number = 5) {
  return useQuery<PaginatedEvents>({
    queryKey: [...eventsKeys.recent(), { limit }],
    queryFn: () => eventsApi.getRecentEvents(limit),
  });
}