import React from 'react';
import { renderWithProviders, screen } from '../../tests/renderWithProviders';
import DatasetListSubmenuItem from './index';

const singleItem = {
  title: 'Dataset Title',
  theme: ['dkan'],
  keyword: ['my keyword'],
};

describe('<DatasetListSubmenuItem />', () => {
  test('Renders correctly', () => {
    renderWithProviders(
      <DatasetListSubmenuItem
        title={singleItem.title}
        theme={singleItem.theme}
        identifier={"test"}
      />
    );

    expect(screen.getByRole('link', { name: 'Dataset Title' })).toBeInTheDocument();
  });
});
