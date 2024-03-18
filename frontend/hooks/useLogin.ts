import { useMutation } from "react-query";
import { useRouter } from "next/router";

import { axios } from "@utils/axios";
import { useTeam } from "@context/TeamContext";
import { Team } from "@models/team";

export function useLogin() {
  const { setTeam } = useTeam();
  const router = useRouter();

  const mutation = useMutation<Team, unknown, { id: string; password: string }>(
    async ({ id, password }) => {
      const response = await axios.post("/login", { id, password });
      return response.data;
    },
    {
      onSuccess: (data) => {
        setTeam(data);
        router.push("/");
      },
    }
  );

  return mutation;
}
