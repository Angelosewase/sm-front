
// b:\Work\sengel\sm-front\lib\api\events.ts
import { axiosInstance } from "../axios";

export interface EventDto {
  id: string;
  eventType: string;
  details: string;
  user?: {
    id: string;
    name: string;
  };
  resourceType?: string;
  resourceId?: string;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
}


export interface PaginatedEvents {
  events: EventDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const eventsApi = {
  getRecentEvents: async (limit: number = 5): Promise<PaginatedEvents> => {
    const { data } = await axiosInstance.get(`/api/events/recent?limit=${limit}`);
    return data;
  },
};