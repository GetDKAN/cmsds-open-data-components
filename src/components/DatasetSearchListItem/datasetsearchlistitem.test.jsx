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
    expect(screen.getByRole('link', { name: 'Download' })).toBeInTheDocument();
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

test('Renders date details', () => {
  const props = {...singleItem}
  props.released = '2021-10-22'
  props.refresh = '2022-10-22'
  render(
    <MemoryRouter>
      <DatasetSearchListItem
        title={props.title}
        modified={props.modified}
        released={props.released}
        refresh={props.refresh}
        description="test"
        theme={props.theme}
        url="/dataset/test"
        downloadUrl="test.com"
        location={mockLocation}
        paginationEnabled={false}
        dataDictionaryLinks={false}
        largeFile={false}
        showDateDetails
      />
    </MemoryRouter>
  );
  expect(screen.getByText((_, el) => el?.className === 'dataset-date-item-label ' && el?.textContent === 'Last Modified: October 22, 2020')).toBeInTheDocument();
  expect(screen.getByText((_, el) => el?.className === 'dataset-date-item-label ' && el?.textContent === 'Released: October 22, 2021')).toBeInTheDocument();
  expect(screen.getByText((_, el) => el?.className === 'dataset-date-item-label ' && el?.textContent === 'Planned Update: October 22, 2022')).toBeInTheDocument();
});
test('Renders topic slugs', () => {
  const props = {...singleItem}
  props.released = '2021-10-22'
  props.refresh = '2022-10-22'
  props.theme = ['Home health services']
  props.topicSlugs = { "Home health services": "home-health-services" }
  render(
    <MemoryRouter>
      <DatasetSearchListItem
        title={props.title}
        modified={props.modified}
        released={props.released}
        refresh={props.refresh}
        description="test"
        theme={props.theme}
        url="/dataset/test"
        downloadUrl="test.com"
        location={mockLocation}
        paginationEnabled={false}
        dataDictionaryLinks={false}
        largeFile={false}
        showDateDetails
        showTopics
        topicSlugs={props.topicSlugs}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('Home health services')).toBeInTheDocument()
});
test('Renders disabled data dictionary link', () => {
  const props = {...singleItem}
  props.distribution = {}
  render(
    <MemoryRouter>
      <DatasetSearchListItem
        title={props.title}
        modified={props.modified}
        released={props.released}
        refresh={props.refresh}
        description="test"
        theme={props.theme}
        url="/dataset/test"
        downloadUrl="test.com"
        location={mockLocation}
        paginationEnabled={false}
        dataDictionaryLinks={true}
        largeFile={false}
        distribution={props.distribution}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('Data Dictionary')).toBeInTheDocument();
  const link = screen.getByText('Data Dictionary')
  expect(link).toHaveClass('dkan-disabled-link')
});
test('Renders data dictionary link from pdf', () => {
  const props = {...singleItem}
  props.identifier = "test"
  props.distribution = {
    "data": {
      "describedBy": "s3://913461122956-pdc-dev-test-minimal-data/attached-dictionary.pdf",
      "describedByType": "application/pdf",
      "%Ref:downloadURL": []
    }
  }
  render(
    <MemoryRouter>
      <DatasetSearchListItem
        title={props.title}
        modified={props.modified}
        released={props.released}
        refresh={props.refresh}
        description="test"
        theme={props.theme}
        url="/dataset/test"
        downloadUrl="test.com"
        location={mockLocation}
        paginationEnabled={false}
        dataDictionaryLinks={true}
        largeFile={false}
        showDateDetails
        showTopics
        topicSlugs={props.topicSlugs}
        identifier={props.identifier}
        distribution={props.distribution}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('Data Dictionary')).toBeInTheDocument();
  const link = screen.getByText('Data Dictionary')
  expect(link).toHaveAttribute('href', '/dataset/test#data-dictionary')
});
test('Renders data dictionary link from json', () => {
  const props = {...singleItem}
  props.identifier = "test"
  props.distribution = {
    "data": {
      "describedBy": "https://example.com/data-dictionary.json",
      "describedByType": "application/vnd.tableschema+json",
      "%Ref:downloadURL": []
    }
  }
  render(
    <MemoryRouter>
      <DatasetSearchListItem
        title={props.title}
        modified={props.modified}
        released={props.released}
        refresh={props.refresh}
        description="test"
        theme={props.theme}
        url="/dataset/test"
        downloadUrl="test.com"
        location={mockLocation}
        paginationEnabled={false}
        dataDictionaryLinks={true}
        largeFile={false}
        showDateDetails
        showTopics
        topicSlugs={props.topicSlugs}
        identifier={props.identifier}
        distribution={props.distribution}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('Data Dictionary')).toBeInTheDocument();
  const link = screen.getByText('Data Dictionary')
  expect(link).toHaveAttribute('href', '/dataset/test#data-dictionary')
});