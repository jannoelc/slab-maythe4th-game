import { useMutation } from "react-query";
import { useRouter } from "next/router";

import { axios } from "@utils/axios";
import { useTeam } from "@context/TeamContext";

export function useLogout() {
  const { setTeam } = useTeam();
  const router = useRouter();

  const mutation = useMutation(
    async () => {
      await axios.post("/logout");
    },
    {
      onSuccess: () => {
        setTeam(undefined);
        router.push("/login");
      },
    }
  );

  return mutation;
}
