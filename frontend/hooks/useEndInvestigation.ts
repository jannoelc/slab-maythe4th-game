import { useMutation } from "react-query";
import { useRouter } from "next/router";

import { axios } from "@utils/axios";
import { useTeam } from "@context/TeamContext";
import { Team } from "@models/team";

export function useEndInvestigation() {
  const { setTeam } = useTeam();
  const router = useRouter();

  const mutation = useMutation<Team>(
    async () => {
      const response = await axios.patch("/team/investigation/end");
      return response.data;
    },
    {
      onSuccess: (data) => {
        setTeam(data);
      },
    }
  );

  return mutation;
}
