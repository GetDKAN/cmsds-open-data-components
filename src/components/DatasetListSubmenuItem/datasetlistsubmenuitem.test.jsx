import React from 'react';
import { render, screen } from '@testing-library/react';
import DatasetListSubmenuItem from './index';
import { MemoryRouter } from 'react-router-dom';

const singleItem = {
  title: 'Dataset Title',
  theme: ['dkan'],
  keyword: ['my keyword'],
};

describe('<DatasetListSubmenuItem />', () => {
  test('Renders correctly', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <DatasetListSubmenuItem
          title={singleItem.title}
          theme={singleItem.theme}
          identifier={"test"}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Dataset Title' })).toBeInTheDocument();
  });
});



