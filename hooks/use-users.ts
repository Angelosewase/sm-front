import { ListUsersFilter, PaginatedUsersResponse } from "@/types/users.dto";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/lib/api/users";

export const useUsers = (filter: ListUsersFilter = {}) => {
  return useQuery<PaginatedUsersResponse, Error>({
    queryKey: ["users", filter],
    queryFn: () => usersApi.getUsers(filter),
  });
};
