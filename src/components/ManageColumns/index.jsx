import React, { useState } from 'react';
import { Button } from '@cmsgov/design-system';

const ManageColumns = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return <Button onClick={() => setModalOpen(!modalOpen)}>Manage Columns</Button>;
};

export default ManageColumns;
