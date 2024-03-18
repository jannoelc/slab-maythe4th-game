import { FC } from "react";
import { useRouter } from "next/router";
import { message, Modal, Typography } from "antd";

import { useLogout } from "@hooks/useLogout";

interface Props {
  visible: boolean;
  onClose(): void;
}

const LogoutModal: FC<Props> = ({ visible, onClose }) => {
  const router = useRouter();
  const { isLoading, mutateAsync } = useLogout();

  return (
    <Modal
      title="Confirm Logout"
      visible={visible}
      onOk={async () => {
        try {
          await mutateAsync();
        } catch (error) {
          message.error("Something went wrong while logging out.");
          router.reload();
        } finally {
          onClose();
        }
      }}
      confirmLoading={isLoading}
      onCancel={onClose}
    >
      <Typography.Paragraph>
        Are you sure you want to Logout?
      </Typography.Paragraph>
    </Modal>
  );
};

export default LogoutModal;
