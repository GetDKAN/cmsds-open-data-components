import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatasetSearchListItem from './index';
import { truncateText } from './truncateText';
import { MemoryRouter } from 'react-router-dom';

const singleItem = {
  title: 'Dataset Title',
  modified: '2020-10-22',
  description: 'This is my description.',
  theme: ['dkan'],
  keyword: ['my keyword'],
};

const mockLocation = {
  pathname: '/search',
  search: '',
  hash: '',
  state: null
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
          url="/dataset/test"
          location={mockLocation}
          paginationEnabled={false}
          dataDictionaryLinks={false}
          largeFile={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Dataset Title' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dataset Title' })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.textContent === 'Updated: October 22, 2020';
    })).toBeInTheDocument();
  });
  test('Renders correctly with Download button', () => {
    render(
      <MemoryRouter>
        <DatasetSearchListItem
          title={singleItem.title}
          modified={singleItem.modified}
          description={singleItem.description}
          theme={singleItem.theme}
          url="/dataset/test"
          downloadUrl="test.com"
          location={mockLocation}
          paginationEnabled={false}
          dataDictionaryLinks={false}
          largeFile={false}
        />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Download Icon Download' })).toBeInTheDocument();
  });

  test('Renders themes when showTopics is true', () => {
    const themeData = ['Healthcare', 'Medicare'];

    render(
      <MemoryRouter>
        <DatasetSearchListItem
          title={singleItem.title}
          modified={singleItem.modified}
          description={singleItem.description}
          theme={themeData}
          url="/dataset/test"
          showTopics={true}
          location={mockLocation}
          paginationEnabled={false}
          dataDictionaryLinks={false}
          largeFile={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Healthcare')).toBeInTheDocument();
    expect(screen.getByText('Medicare')).toBeInTheDocument();
  });

  test('Does not render themes when showTopics is false', () => {
    const themeData = ['Healthcare', 'Medicare'];

    render(
      <MemoryRouter>
        <DatasetSearchListItem
          title={singleItem.title}
          modified={singleItem.modified}
          description={singleItem.description}
          theme={themeData}
          url="/dataset/test"
          showTopics={false}
          location={mockLocation}
          paginationEnabled={false}
          dataDictionaryLinks={false}
          largeFile={false}
        />
      </MemoryRouter>
    );

    expect(screen.queryByText('Healthcare')).not.toBeInTheDocument();
    expect(screen.queryByText('Medicare')).not.toBeInTheDocument();
  });

  test('Handles theme with empty strings', () => {
    const themeData = ['', 'Medicare'];

    render(
      <MemoryRouter>
        <DatasetSearchListItem
          title={singleItem.title}
          modified={singleItem.modified}
          description={singleItem.description}
          theme={themeData}
          url="/dataset/test"
          showTopics={true}
          location={mockLocation}
          paginationEnabled={false}
          dataDictionaryLinks={false}
          largeFile={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Unknown Topic')).toBeInTheDocument();
    expect(screen.getByText('Medicare')).toBeInTheDocument();
  });
});

test('Renders description', () => {
  render(
    <MemoryRouter>
      <DatasetSearchListItem
        title={singleItem.title}
        modified={singleItem.modified}
        description={'This is my description.'}
        theme={singleItem.theme}
        url="/dataset/test"
        downloadUrl="test.com"
        location={mockLocation}
        paginationEnabled={false}
        dataDictionaryLinks={false}
        largeFile={false}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('This is my description.')).toBeInTheDocument();
});

test('Renders description text before <br/>', () => {
  render(
    <MemoryRouter>
      <DatasetSearchListItem
        title={singleItem.title}
        modified={singleItem.modified}
        description={'This is my description.<br/> Some more text.'}
        theme={singleItem.theme}
        url="/dataset/test"
        downloadUrl="test.com"
        location={mockLocation}
        paginationEnabled={false}
        dataDictionaryLinks={false}
        largeFile={false}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('This is my description.')).toBeInTheDocument();
});

test('Renders description text without <b>', () => {
  render(
    <MemoryRouter>
      <DatasetSearchListItem
        title={singleItem.title}
        modified={singleItem.modified}
        description={'<b>This is my description.</b>'}
        theme={singleItem.theme}
        url="/dataset/test"
        downloadUrl="test.com"
        location={mockLocation}
        paginationEnabled={false}
        dataDictionaryLinks={false}
        largeFile={false}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('This is my description.')).toBeInTheDocument();
});

test('Renders description text without <p>', () => {
  render(
    <MemoryRouter>
      <DatasetSearchListItem
        title={singleItem.title}
        modified={singleItem.modified}
        description={'<p>This is my description.</p>'}
        theme={singleItem.theme}
        url="/dataset/test"
        downloadUrl="test.com"
        location={mockLocation}
        paginationEnabled={false}
        dataDictionaryLinks={false}
        largeFile={false}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('This is my description.')).toBeInTheDocument();
});

test('Renders first <p> of description text without the <p>', () => {
  render(
    <MemoryRouter>
      <DatasetSearchListItem
        title={singleItem.title}
        modified={singleItem.modified}
        description={'<p>This is my description.</p><p>This is some more text</p>'}
        theme={singleItem.theme}
        url="/dataset/test"
        downloadUrl="test.com"
        location={mockLocation}
        paginationEnabled={false}
        dataDictionaryLinks={false}
        largeFile={false}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('This is my description.')).toBeInTheDocument();
});

test('Renders description text before <br/> without <p>', () => {
  render(
    <MemoryRouter>
      <DatasetSearchListItem
        title={singleItem.title}
        modified={singleItem.modified}
        description={'<p>This is my description.<br/> This is some more text.</p>'}
        theme={singleItem.theme}
        url="/dataset/test"
        downloadUrl="test.com"
        location={mockLocation}
        paginationEnabled={false}
        dataDictionaryLinks={false}
        largeFile={false}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('This is my description.')).toBeInTheDocument();
});

test('Renders description text with up to 240 characters', () => {
  render(
    <MemoryRouter>
      <DatasetSearchListItem
        title={singleItem.title}
        modified={singleItem.modified}
        description={'This is my description. It is really really really really long. But we should only show a small part of it. How about we only show the first 3 lines of 80 characters. That should be something like 240 characters. I think this text is now at about 262 characters. That is less than 300, did you know that? Well now it is over 300!'}
        theme={singleItem.theme}
        url="/dataset/test"
        downloadUrl="test.com"
        location={mockLocation}
        paginationEnabled={false}
        dataDictionaryLinks={false}
        largeFile={false}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('This is my description. It is really really really really long. But we should only show a small part of it. How about we only show the first 3 lines of 80 characters. That should be something like 240 characters. I think this text is now...')).toBeInTheDocument();
});

test('Can overwrite truncateText textLength', () => {
  expect(truncateText('This is my description.', 8)).toBe('This...');
});