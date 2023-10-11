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
    render(
      <MemoryRouter>
        <DatasetSearchListItem
          title={singleItem.title}
          modified={singleItem.modified}
          description={singleItem.description}
          theme={singleItem.theme}
          identifier={"test"}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Dataset Title' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dataset Title' })).toBeInTheDocument();
    expect(screen.getByText('Updated October 22, 2020')).toBeInTheDocument();
  });
  test('Renders correctly with Download button', () => {
    render(
      <MemoryRouter>
        <DatasetSearchListItem
          title={singleItem.title}
          modified={singleItem.modified}
          description={singleItem.description}
          theme={singleItem.theme}
          identifier={"test"}
          showDownload={true}
          downloadUrl={"test.com"}
        />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Download Icon Download' })).toBeInTheDocument();
  });
});
