import type { NextPage } from "next";
import Head from "next/head";
import { Card, Row, Col } from "antd";

import PageLayout from "@components/PageLayout/PageLayout";
import { useTeamsLeadCountList } from "@hooks/useTeamsLeadCountList";
import { Team } from "@models/team";
import { FileSearchOutlined } from "@ant-design/icons";

function compareByScoreboardRules(a: Team, b: Team) {
  if (a.investigationEndDate || b.investigationEndDate) {
    if (!b.investigationEndDate) {
      return -1;
    }

    if (!a.investigationEndDate) {
      return 1;
    }

    if (a.distinctLeadsCount !== b.distinctLeadsCount) {
      return a.distinctLeadsCount - b.distinctLeadsCount;
    }

    return a.investigationEndDate - b.investigationEndDate;
  }

  if (a.distinctLeadsCount !== b.distinctLeadsCount) {
    return a.distinctLeadsCount - b.distinctLeadsCount;
  }

  return a.id > b.id ? 1 : -1;
}

const ScoreboardPage: NextPage = () => {
  const { data: teams, isFetching } = useTeamsLeadCountList();

  return (
    <div>
      <Head>
        <title>Scoreboard</title>
        <meta name="description" content="" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <PageLayout>
        <Row gutter={[24, 24]}>
          {teams
            ?.map((t) => ({ ...t }))
            .sort(compareByScoreboardRules)
            .map((team) => (
              <Col
                key={team.id}
                lg={{ span: 4 }}
                md={{ span: 6 }}
                sm={{ span: 12 }}
                xs={{ span: 24 }}
              >
                <Card title={`Team ${+team.id.split("team")[1]}`}>
                  <h2>
                    <FileSearchOutlined />
                    {` ${team.distinctLeadsCount}`}
                  </h2>
                  {team.investigationEndDate && (
                    <h1>{`Investigation ended: ${new Date(
                      team.investigationEndDate
                    ).toLocaleTimeString()}`}</h1>
                  )}
                  <h5>{team.members.join(", ")}</h5>
                </Card>
              </Col>
            ))}
        </Row>
      </PageLayout>
    </div>
  );
};

export default ScoreboardPage;
