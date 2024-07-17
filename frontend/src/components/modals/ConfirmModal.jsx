import React, { useEffect } from 'react';
import { Modal, Button } from 'antd';
import styled from 'styled-components';

const ConfirmModal = ({
  visible,
  onCancel,
  onConfirm,
  confirmLoading,
  content,
  type = "confirm", // "confirm" or "alert"
}) => {

  useEffect(() => {
    if (type === "alert" && visible) {
      const timer = setTimeout(() => {
        onCancel();
      }, 5000); // Auto close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [visible, type, onCancel]);

  return (
    <StyledModal
      visible={visible}
      onCancel={onCancel}
      centered={type !== "alert"}
      bodyStyle={{ color: 'var(--color-yellow)' }}
      footer={
        type === "confirm" ? [
          <Button
            key="back"
            onClick={onCancel}
            style={{ background: '#f0f0f0', border: 'none', color: 'black' }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={confirmLoading}
            onClick={onConfirm}
            style={{ background: '#1890ff', border: 'none', color: 'white' }}
          >
            Confirm
          </Button>
        ] : null
      }
      closable={type !== "alert"}
      maskClosable={type === "alert"}
      wrapClassName={type === "alert" ? 'alert-modal' : ''}
    >
      {content}
    </StyledModal>
  );
};

export default ConfirmModal;

const StyledModal = styled(Modal)`
  &.alert-modal {
    top: 10%;
    .ant-modal-content {
      border-radius: 10px;
    }
    .ant-modal-header {
      border-bottom: none;
    }
    .ant-modal-footer {
      display: none;
    }
  }
`;
