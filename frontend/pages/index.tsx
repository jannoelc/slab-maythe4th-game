import type { NextPage } from "next";
import Head from "next/head";
import { Remark } from "react-remark";
import { BackTop, Skeleton } from "antd";

import { useIntroduction } from "@hooks/useIntroduction";
import PageLayout from "@components/PageLayout/PageLayout";

import styles from "./styles.module.scss";

const Home: NextPage = () => {
  const { data, isLoading } = useIntroduction();

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
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
          <article className={styles.article}>
            <Remark>{data?.content ?? ""}</Remark>
          </article>
        )}
        <div className={styles.audioContainer}>
          {data?.audio && (
            <audio controls>
              <source src={data.audio} type="audio/ogg" />
            </audio>
          )}
        </div>
      </PageLayout>
    </>
  );
};

export default Home;
