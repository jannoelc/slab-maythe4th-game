import type { NextPage } from "next";
import Head from "next/head";
import { Button, Col, Form, Input, message, Row } from "antd";
import { KeyOutlined, TeamOutlined } from "@ant-design/icons";

import { useLogin } from "@hooks/useLogin";
import { useAuthenticationRedirect } from "@hooks/useAuthenticationRedirect";
import PageLayout from "@components/PageLayout/PageLayout";

import styles from "./styles.module.scss";
import { AxiosError } from "axios";
import useFormInstance from "antd/lib/form/hooks/useFormInstance";

interface FormValues {
  id: string;
  password: string;
}

const initialValues: FormValues = {
  id: "",
  password: "",
};

const LoginPage: NextPage = () => {
  useAuthenticationRedirect(false);

  const { mutateAsync, isLoading } = useLogin();

  const form = useFormInstance();

  const handleFinish = async (values: FormValues) => {
    try {
      const team = await mutateAsync(values);
      message.success(`Logged in as ${team.id}`);
    } catch (error) {
      if (
        (error as AxiosError).response?.data &&
        ((error as AxiosError).response?.data as any).error ===
          "INVALID_CREDENTIALS"
      ) {
        message.error("Invalid id and/or password.");
      } else {
        message.error("Something went wrong.");
      }
    }
  };

  const handleFinishFailed = (error: any) => {
    console.log(error.response?.data);
  };

  return (
    <>
      <Head>
        <title>Login</title>
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
        <Row align="middle" justify="center" className={styles.content}>
          <Col>
            <Form
              name="login"
              initialValues={initialValues}
              onFinish={handleFinish}
              onFinishFailed={handleFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="id"
                rules={[
                  { required: true, message: "ID is required" },
                  { whitespace: true, message: "ID is required" },
                  {
                    type: "string",
                    max: 32,
                    message: "ID cannot be longer than 32 characters",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Team ID"
                  prefix={<TeamOutlined />}
                  disabled={isLoading}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Password is required" },
                  { whitespace: true, message: "Password is required" },
                  {
                    type: "string",
                    max: 48,
                    message: "ID cannot be longer than 48 characters",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Password"
                  prefix={<KeyOutlined />}
                  disabled={isLoading}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={isLoading}
                >
                  LOGIN
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </PageLayout>
    </>
  );
};

export default LoginPage;
