import { FC, PropsWithChildren, useMemo, useState } from "react";
import Link from "next/link";
import { Layout, Menu, Skeleton } from "antd";
import {
  FileSearchOutlined,
  FileDoneOutlined,
  SearchOutlined,
  LoginOutlined,
  LogoutOutlined,
  BarChartOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import { useTeam } from "@context/TeamContext";
import LogoutModal from "@components/LogoutModal/LogoutModal";
import EndInvestigationModal from "@components/EndInvestigationModal/EndInvestigationModal";
import { Team } from "@models/team";

import styles from "./PageLayout.module.scss";

const isLoadingMenuItems = [1, 2, 3].map((key) => ({
  key,
  icon: (
    <Skeleton.Button
      size="small"
      shape="circle"
      className={styles.skeletonMenuItem}
    />
  ),
  label: <Skeleton.Input size="small" className={styles.skeletonMenuItem} />,
  disabled: true,
}));

const PageLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { team, isLoaded } = useTeam();

  const [isLogoutModalVisible, setLogoutModalVisibility] = useState(false);
  const [isEndInvestigationModalVisible, setEndInvestigationModalVisibility] =
    useState(false);

  const visibleMenuItems = useMemo(() => {
    if (!isLoaded) {
      return isLoadingMenuItems;
    }

    const menuItems = [
      {
        key: "Introduction",
        icon: (
          <Link href="/" passHref>
            <FileSearchOutlined />
          </Link>
        ),
        label: <Link href="/">Introduction</Link>,
        shouldShow: (_?: Team) => true,
      },
      {
        key: "Scoreboard",
        icon: (
          <Link href="/scoreboard" passHref>
            <BarChartOutlined />
          </Link>
        ),
        label: <Link href="/scoreboard">Scoreboard</Link>,
        shouldShow: (_?: Team) => true,
      },
      {
        key: "TeamMembers",
        icon: (
          <Link href="/team" passHref>
            <TeamOutlined />
          </Link>
        ),
        label: <Link href="/team">Team Members</Link>,
        shouldShow: (team?: Team) => !!team,
      },
      {
        key: "LeadsFollowed",
        icon: (
          <Link href="/leads" passHref>
            <SearchOutlined />
          </Link>
        ),
        label: <Link href="/leads">Leads Followed</Link>,
        shouldShow: (team?: Team) => !!team,
      },
      {
        key: "EndInvestigation",
        icon: <FileDoneOutlined />,
        label: "End Investigation",
        shouldShow: (team?: Team) =>
          !!team &&
          (team.investigationEndDate === null ||
            team.investigationEndDate === undefined),
        onClick() {
          setEndInvestigationModalVisibility(true);
        },
      },
      {
        key: "Login",
        icon: (
          <Link href="/login" passHref>
            <LoginOutlined />
          </Link>
        ),
        label: <Link href="/login">Login</Link>,
        shouldShow: (team?: Team) => !team,
      },
      {
        key: "Logout",
        icon: <LogoutOutlined />,
        label: "Logout",
        shouldShow: (team?: Team) => team,
        onClick() {
          setLogoutModalVisibility(true);
        },
      },
    ];

    return menuItems
      .filter(({ shouldShow }) => shouldShow(team))
      .map(({ shouldShow, ...menuItem }) => menuItem);
  }, [team, isLoaded]);

  return (
    <>
      <Layout>
        <Layout>
          <Layout.Content className={styles.content}>{children}</Layout.Content>
        </Layout>
        <Layout.Sider
          breakpoint="lg"
          className={styles.sider}
          collapsible
          collapsedWidth={0}
          zeroWidthTriggerStyle={{
            top: 24,
            left: -36,
            borderRadius: "2px 0 0 2px",
          }}
          theme="dark"
        >
          <Menu
            mode="inline"
            items={visibleMenuItems}
            theme="dark"
            selectable={false}
          />
        </Layout.Sider>
      </Layout>
      <LogoutModal
        visible={isLogoutModalVisible}
        onClose={() => {
          setLogoutModalVisibility(false);
        }}
      />
      <EndInvestigationModal
        visible={isEndInvestigationModalVisible}
        onClose={() => {
          setEndInvestigationModalVisibility(false);
        }}
      />
    </>
  );
};

export default PageLayout;
