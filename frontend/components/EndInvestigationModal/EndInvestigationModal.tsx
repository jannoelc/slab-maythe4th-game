import { FC } from "react";
import { Alert, Modal, Typography, Form, Input, message } from "antd";

import { useEndInvestigation } from "@hooks/useEndInvestigation";

interface FormValues {
  confirm: string;
}

const initialValues: FormValues = {
  confirm: "",
};

interface Props {
  visible: boolean;
  onClose(): void;
}

const EndInvestigationModal: FC<Props> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const { isLoading, mutateAsync } = useEndInvestigation();

  const handleFinish = async () => {
    try {
      await mutateAsync();
      message.success(
        "The investigation has ended. Please reach out to the game masters."
      );
    } catch (error) {
      message.error("Something went wrong. Please refresh the page.");
    } finally {
      onClose();
    }
  };

  return (
    <Modal
      title="Confirm End Investigation"
      visible={visible}
      onOk={() => {
        form.submit();
      }}
      okButtonProps={{
        htmlType: "submit",
      }}
      confirmLoading={isLoading}
      onCancel={onClose}
      destroyOnClose
    >
      <Alert
        message="Warning"
        description="You won't be able to follow new leads aside
    from the ones you have already visited."
        type="warning"
        showIcon
      />
      <br />
      <Typography.Paragraph>
        Type <Typography.Text code>CONFIRM</Typography.Text> and press OK button
        to end investigation.
      </Typography.Paragraph>
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={handleFinish}
        autoComplete="off"
        preserve={false}
      >
        <Form.Item
          name="confirm"
          rules={[
            { required: true, message: "Required field" },
            {
              pattern: /^(CONFIRM)$/,
              message: "Incorrect keyword",
              validateTrigger: "onSubmit",
            },
          ]}
        >
          <Input placeholder="Type CONFIRM" disabled={isLoading} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EndInvestigationModal;
