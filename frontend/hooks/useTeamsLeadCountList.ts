import { useQuery } from "react-query";

import { axios } from "@utils/axios";
import { Team } from "@models/team";

export function useTeamsLeadCountList() {
  const query = useQuery<Array<Team>>(
    ["teams", "lead-count", "list"],
    async () => {
      const { data } = await axios.get<Record<"teams", Array<Team>>>(
        "/teams/lead-count"
      );

      return data?.teams || [];
    },
    { refetchInterval: 10000 }
  );

  return query;
}
