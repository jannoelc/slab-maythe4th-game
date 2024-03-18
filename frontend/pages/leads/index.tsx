import { useMemo } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { Alert, Col, Row, Statistic, Table } from "antd";
import Link from "next/link";
import { FileSearchOutlined, SearchOutlined } from "@ant-design/icons";

import { useAuthenticationRedirect } from "@hooks/useAuthenticationRedirect";
import PageLayout from "@components/PageLayout/PageLayout";
import { useTeam } from "@context/TeamContext";

const columns = [
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Link",
    dataIndex: "leadId",
    key: "link",
    render: (leadId: string) => (
      <Link href={`/leads/${leadId}`}>Go to Lead</Link>
    ),
  },
];

const LeadsPage: NextPage = () => {
  useAuthenticationRedirect(true);

  const { team, isLoaded } = useTeam();

  const data = useMemo(() => {
    return team?.leadsVisited
      .map((lead) => ({ ...lead, key: lead.leadId }))
      .filter(
        (value, index, self) =>
          self.findIndex((v) => value.address === v.address) === index
      )
      .sort((a, b) => {
        const [aNumber, aArea] = a.address.split(" ");
        const [bNumber, bArea] = b.address.split(" ");

        const aNum = +aNumber.split("-")[0];
        const bNum = +bNumber.split("-")[0];

        if (aNum < bNum) {
          return -1;
        } else if (aNum > bNum) {
          return 1;
        }

        if (aArea < bArea) {
          return -1;
        } else {
          return 1;
        }
      });
  }, [team]);

  return (
    <div>
      <Head>
        <title>Leads</title>
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
        <Row gutter={16}>
          <Col span={24} sm={12} style={{ marginBottom: "24px" }}>
            <Statistic
              title="Distinct Leads Followed"
              value={team?.distinctLeadsCount}
              loading={!isLoaded}
              prefix={<FileSearchOutlined />}
            />
          </Col>
          <Col span={24} sm={12} style={{ marginBottom: "24px" }}>
            <Statistic
              title="Leads Followed"
              value={team?.leadsVisited.length}
              loading={!isLoaded}
              prefix={<SearchOutlined />}
            />
          </Col>
          {team?.investigationEndDate && (
            <Col span={24} style={{ marginBottom: "24px" }}>
              <Alert
                message="Your investigation has ended"
                description="You won't be able to follow new leads aside from the ones you have already visited."
                type="success"
                showIcon
              />
            </Col>
          )}
        </Row>
        <Row>
          <Col span={24}>
            <Table columns={columns} dataSource={data} loading={!isLoaded} />
          </Col>
        </Row>
      </PageLayout>
    </div>
  );
};

export default LeadsPage;
