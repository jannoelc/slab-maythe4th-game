import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Remark } from "react-remark";
import { Alert, BackTop, Skeleton } from "antd";

import { useLeads } from "@hooks/useLeads";
import { useAuthenticationRedirect } from "@hooks/useAuthenticationRedirect";
import PageLayout from "@components/PageLayout/PageLayout";

import styles from "./styles.module.scss";

const LeadDetailsPage: NextPage = () => {
  useAuthenticationRedirect(true);

  const router = useRouter();

  const { data, isLoading, error } = useLeads(router.query.leadId as string);

  return (
    <div>
      <Head>
        <title>Lead {data?.address ? `- ${data?.address}` : ""}</title>
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
        <BackTop style={{ left: 24 }} />
        {isLoading ? (
          <>
            <Skeleton title />
            <Skeleton paragraph={{ rows: 4 }} />
            <Skeleton paragraph={{ rows: 4 }} />
          </>
        ) : (
          <>
            <h1 className={styles.heading}>{data?.address}</h1>
            <article className={styles.article}>
              <Remark>{data?.content ?? ""}</Remark>
            </article>

            {error?.response?.status === 405 && (
              <Alert
                message="Your investigation has ended"
                description="You won't be able to follow new leads aside from the ones you have already visited."
                type="success"
                showIcon
              />
            )}
          </>
        )}
      </PageLayout>
    </div>
  );
};

export default LeadDetailsPage;
