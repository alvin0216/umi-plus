import { Button, DatePicker, Modal } from 'antd';
import { useCallback, useState } from 'react';

import styles from './index.less';

export default function IndexPage() {
  const { modalProps, show } = useModal();
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <DatePicker />
      <Button onClick={show} type="primary">
        open Modal
      </Button>
      <Modal {...modalProps}>Hello World</Modal>
    </div>
  );
}

function useModal() {
  const [visible, setVisible] = useState(false);
  const show = useCallback(() => setVisible(true), [visible]);
  const close = useCallback(() => setVisible(false), [visible]);

  const modalProps = {
    visible,
    onCancel: close,
  };

  return {
    visible,
    show,
    close,
    modalProps,
  };
}
