import { useQuery } from "react-query";

import { axios } from "@utils/axios";
import { useTeam } from "@context/TeamContext";
import { Lead } from "@models/lead";
import { AxiosError } from "axios";

export function useLeads(leadId?: string) {
  const { setTeam } = useTeam();

  const query = useQuery<Lead, AxiosError>(
    ["leads", leadId],
    async ({ queryKey }) => {
      const [_, id] = queryKey;
      const { data } = await axios.post(`/leads/${id}/visit`, {
        params: { id },
      });

      const { lead, team } = data;

      // Side-effect
      if (team) {
        setTeam(team);
      }

      return lead;
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!leadId,
      retry: false,
    }
  );

  return query;
}
