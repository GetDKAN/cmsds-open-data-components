import React from 'react';
import ManageColumns from './ManageColumns';
import ManageColumnsContext from './ManageColumnsContext';

const meta = {
  title: 'Components/ManageColumns',
  component: ManageColumns,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `\nThe ManageColumns component provides a dialog for reordering and toggling visibility of table columns, with drag-and-drop and accessibility features.\n        `,
      },
    },
  },
  argTypes: {
    id: { control: 'text', description: 'Unique identifier for the table.' },
    columns: { control: 'object', description: 'Array of column objects with id and getIsVisible.' },
    defaultColumnOrder: { control: 'object', description: 'Default order of column ids.' },
    modalOpen: { control: 'boolean', description: 'Whether the dialog is open.' },
    setModalOpen: { table: { disable: true } },
  },
  tags: ['autodocs'],
};

export default meta;

function mockGetIsVisibleFactory(visible) {
  return () => visible;
}

const mockContextValue = {
  columnOrder: ['name', 'age', 'email'],
  setColumnOrder: () => {},
  setColumnVisibility: () => {},
};

export const Default = {
  args: {
    id: 'table-1',
    columns: [
      { id: 'name', getIsVisible: mockGetIsVisibleFactory(true) },
      { id: 'age', getIsVisible: mockGetIsVisibleFactory(true) },
      { id: 'email', getIsVisible: mockGetIsVisibleFactory(false) },
    ],
    defaultColumnOrder: ['name', 'age', 'email'],
    modalOpen: true,
    setModalOpen: () => {},
  },
  render: (args, { viewMode }) => (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <ManageColumnsContext.Provider value={mockContextValue}>
        <ManageColumns {...args} modalOpen={viewMode === 'story'} />
      </ManageColumnsContext.Provider>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays the ManageColumns dialog with sample columns and default order.'
      }
    }
  }
};
