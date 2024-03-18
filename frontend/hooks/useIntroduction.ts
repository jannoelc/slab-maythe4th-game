import { useQuery } from "react-query";

import { Introduction } from "@models/introduction";
import { axios } from "@utils/axios";

export function useIntroduction() {
  const query = useQuery<Introduction>(
    "introduction",
    async () => {
      const { data } = await axios.get("/introduction");
      return data;
    },
    { staleTime: Infinity, refetchOnMount: false, refetchOnWindowFocus: false }
  );

  return query;
}
