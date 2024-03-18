import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { Team } from "@models/team";
import { axios } from "@utils/axios";
import { message } from "antd";

const TeamContext = createContext<{
  team?: Team;
  isLoaded: boolean;
  setTeam: Dispatch<SetStateAction<Team | undefined>>;
}>({ setTeam: () => {}, isLoaded: false });

const TeamProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [team, setTeam] = useState<Team | undefined>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const { data: team } = await axios.get("/team");
        setTeam(team);
      } catch (error) {
        setTeam(undefined);
      } finally {
        setIsLoaded(true);
      }
    }

    fetchTeam();
  }, []);

  const teamId = team?.id;

  useEffect(() => {
    if (teamId) {
      console.log("Connecting");
      let socket = new WebSocket(
        "wss://6n96f7g8rh.execute-api.us-east-1.amazonaws.com/dev"
      );

      // Connection opened
      socket.addEventListener("open", function (event) {
        console.log("Connected");
        socket.send(
          JSON.stringify({
            type: "SUBSCRIBE",
            teamId: teamId,
          })
        );
      });

      // Listen for messages
      socket.addEventListener("message", function (event) {
        const newTeam: Team = JSON.parse(event.data);
        console.log(newTeam);
        setTeam((oldTeam) => {
          // I hate myself for doing this!

          if (
            oldTeam &&
            newTeam.distinctLeadsCount > oldTeam.distinctLeadsCount
          ) {
            const latestLead =
              newTeam.leadsVisited[newTeam.leadsVisited.length - 1];

            message.info(`Your team has visited ${latestLead.address}.`);
          } else if (
            oldTeam &&
            !oldTeam.investigationEndDate &&
            newTeam.investigationEndDate
          ) {
            message.info(`Your team has ended the investigation.`);
          }

          // Stop the hate
          return newTeam;
        });
      });

      return () => {
        socket.close();
      };
    }
  }, [teamId]);

  return (
    <TeamContext.Provider value={{ team, setTeam, isLoaded }}>
      {children}
    </TeamContext.Provider>
  );
};

function useTeam() {
  return useContext(TeamContext);
}

export { TeamProvider, useTeam };
