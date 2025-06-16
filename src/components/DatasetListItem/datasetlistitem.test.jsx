import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatasetListItem from './index';
import { truncateText } from './truncateText';
import { MemoryRouter } from 'react-router-dom';

const singleItem = {
  title: 'Dataset Title',
  modified: '2020-10-22',
  description: 'This is my description.',
  theme: ['dkan'],
  keyword: ['my keyword'],
};

describe('<DatasetListItem />', () => {
  test('Renders correctly', () => {
    render(
      <MemoryRouter>
        <DatasetListItem
          title={singleItem.title}
          modified={singleItem.modified}
          description={singleItem.description}
          theme={singleItem.theme}
          identifier={"test"}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Dataset Title' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View the Dataset for Dataset Title' })).toBeInTheDocument();
    expect(screen.getByText('Updated October 22, 2020')).toBeInTheDocument();
  });
});

test('Renders description', () => {
  render(
    <MemoryRouter>
      <DatasetListItem
        title={singleItem.title}
        modified={singleItem.modified}
        description={'This is my description.'}
        theme={singleItem.theme}
        identifier={"test"}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('This is my description.')).toBeInTheDocument();
});

test('Renders description text before <br/>', () => {
  render(
    <MemoryRouter>
      <DatasetListItem
        title={singleItem.title}
        modified={singleItem.modified}
        description={'This is my description.<br/> Some more text.'}
        theme={singleItem.theme}
        identifier={"test"}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('This is my description.')).toBeInTheDocument();
});

test('Renders description text without <b>', () => {
  render(
    <MemoryRouter>
      <DatasetListItem
        title={singleItem.title}
        modified={singleItem.modified}
        description={'<b>This is my description.</b>'}
        theme={singleItem.theme}
        identifier={"test"}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('This is my description.')).toBeInTheDocument();
});

test('Renders description text without <p>', () => {
  render(
    <MemoryRouter>
      <DatasetListItem
        title={singleItem.title}
        modified={singleItem.modified}
        description={'<p>This is my description.</p>'}
        theme={singleItem.theme}
        identifier={"test"}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('This is my description.')).toBeInTheDocument();
});

test('Renders first <p> of description text without the <p>', () => {
  render(
    <MemoryRouter>
      <DatasetListItem
        title={singleItem.title}
        modified={singleItem.modified}
        description={'<p>This is my description.</p><p>This is some more text</p>'}
        theme={singleItem.theme}
        identifier={"test"}
        showDownload={true}
        downloadUrl={"test.com"}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('This is my description.')).toBeInTheDocument();
});

test('Renders description text before <br/> without <p>', () => {
  render(
    <MemoryRouter>
      <DatasetListItem
        title={singleItem.title}
        modified={singleItem.modified}
        description={'<p>This is my description.<br/> This is some more text.</p>'}
        theme={singleItem.theme}
        identifier={"test"}
        showDownload={true}
        downloadUrl={"test.com"}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('This is my description.')).toBeInTheDocument();
});

test('Renders description text with up to 240 characters', () => {
  render(
    <MemoryRouter>
      <DatasetListItem
        title={singleItem.title}
        modified={singleItem.modified}
        description={'This is my description. It is really really really really long. But we should only show a small part of it. How about we only show the first 3 lines of 80 characters. That should be something like 240 characters. I think this text is now at about 262 characters. That is less than 300, did you know that? Well now it is over 300!'}
        theme={singleItem.theme}
        identifier={"test"}
        showDownload={true}
        downloadUrl={"test.com"}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('This is my description. It is really really really really long. But we should only show a small part of it. How about we only show the first 3 lines of 80 characters. That should be something like 240 characters. I think this text is now...')).toBeInTheDocument();
});

test('Can overwrite truncateText textLength', () => {
  expect(truncateText('This is my description.', 8)).toBe('This...');
});
