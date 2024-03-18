import { useRouter } from "next/router";
import { useEffect } from "react";

import { useTeam } from "@context/TeamContext";

export function useAuthenticationRedirect(shouldBeAuthenticated: boolean) {
  const { team, isLoaded } = useTeam();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!team && shouldBeAuthenticated) {
        router.replace("/login");
      } else if (team && !shouldBeAuthenticated) {
        router.replace("/");
      }
    }
  }, [team, isLoaded, shouldBeAuthenticated, router]);

  return isLoaded;
}
