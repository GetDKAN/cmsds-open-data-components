import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DatasetSearchListItem from './index';
import { MemoryRouter } from 'react-router-dom';

const singleItem = {
  title: 'Dataset Title',
  modified: '2020-10-22',
  description: 'This is my description.',
  theme: ['dkan'],
  keyword: ['my keyword'],
};

describe('<DatasetSearchListItem />', () => {
  test('Renders correctly', () => {
    render(<MemoryRouter><DatasetSearchListItem item={singleItem} /></MemoryRouter>);
    const listItemOptions = singleItem.theme.concat(singleItem.keyword);
    const listItems = screen.getAllByRole('listitem');
    listItems.forEach((item, idx) => {
      const { getByText } = within(item);
      expect(getByText(listItemOptions[idx])).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: 'Dataset Title' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dataset Title' })).toBeInTheDocument();
    expect(screen.getByText('Updated October 22, 2020')).toBeInTheDocument();
    // expect(screen.getByText('This is my description.')).toBeInTheDocument();
  });
});
