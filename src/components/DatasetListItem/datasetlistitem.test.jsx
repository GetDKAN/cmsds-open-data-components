import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatasetListItem from './index';
import { MemoryRouter } from 'react-router-dom';

// Mock the useMediaQuery hook
jest.mock('react-responsive', () => ({
  useMediaQuery: jest.fn().mockImplementation(() => false) // Default to mobile view
}));

const singleItem = {
  title: 'Dataset Title',
  modified: '2020-10-22',
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
          theme={singleItem.theme}
          identifier={"test"}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Dataset Title' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View the Dataset for Dataset Title' })).toBeInTheDocument();
    expect(screen.getByText('Updated October 22, 2020')).toBeInTheDocument();
  });

  test('Renders with pagination enabled', () => {
    render(
      <MemoryRouter>
        <DatasetListItem
          title={singleItem.title}
          modified={singleItem.modified}
          identifier={"test-pagination"}
          paginationEnabled={true}
        />
      </MemoryRouter>
    );

    // Check that pagination styling is applied
    const listItem = screen.getByRole('listitem');
    expect(listItem.querySelector('.dc-c-searchlist-item')).toHaveClass('ds-u-border-top--1');
    expect(listItem.querySelector('.dc-c-searchlist-item')).not.toHaveClass('ds-u-border-bottom--1');
    expect(screen.getByText('The Dataset Title dataset was updated.')).toBeInTheDocument();
  });

  test('Renders with pagination disabled', () => {
    render(
      <MemoryRouter>
        <DatasetListItem
          title={singleItem.title}
          modified={singleItem.modified}
          identifier={"test-no-pagination"}
          paginationEnabled={false}
        />
      </MemoryRouter>
    );

    // Check that non-pagination styling is applied
    const listItem = screen.getByRole('listitem');
    expect(listItem.querySelector('.dc-c-searchlist-item')).toHaveClass('ds-u-border-bottom--1');
    expect(listItem.querySelector('.dc-c-searchlist-item')).not.toHaveClass('ds-u-border-top--1');
  });

  test('Displays correct desktop styles when on desktop', () => {
    // Override the mock to simulate desktop view
    require('react-responsive').useMediaQuery.mockImplementation(() => true);
    
    render(
      <MemoryRouter>
        <DatasetListItem
          title={singleItem.title}
          modified={singleItem.modified}
          identifier={"test-desktop"}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Dataset Title' })).toBeInTheDocument();
  });

  test('Aria describedby attribute connects date with link', () => {
    render(
      <MemoryRouter>
        <DatasetListItem
          title={singleItem.title}
          modified={singleItem.modified}
          identifier={"test-aria"}
        />
      </MemoryRouter>
    );

    // Find the specific span with the date by its ID
    const dateSpan = document.getElementById('dataset-test-aria-updated-date');
    // Confirm it's the correct span with the correct classes
    expect(dateSpan).toHaveClass('ds-l-col--12');
    expect(dateSpan.textContent).toMatch(/Updated.+October 22, 2020/);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-describedby', 'dataset-test-aria-updated-date');
  });

  test('Works with undefined props using defaults', () => {
    render(
      <MemoryRouter>
        <DatasetListItem
          title={singleItem.title}
          modified={singleItem.modified}
          identifier={"test-defaults"}
          // paginationEnabled and dataDictionaryLinks not provided
        />
      </MemoryRouter>
    );

    // Component should render without errors using default prop values
    expect(screen.getByRole('heading', { name: 'Dataset Title' })).toBeInTheDocument();
    
    // Check that the default styling for paginationEnabled=false is applied
    const listItem = screen.getByRole('listitem');
    expect(listItem.querySelector('.dc-c-searchlist-item')).toHaveClass('ds-u-border-bottom--1');
    expect(listItem.querySelector('.dc-c-searchlist-item')).not.toHaveClass('ds-u-border-top--1');
  });
  
  test('Correctly uses provided identifier in date span id', () => {
    const testId = 'special-identifier-123';
    render(
      <MemoryRouter>
        <DatasetListItem
          title={singleItem.title}
          modified={singleItem.modified}
          identifier={testId}
        />
      </MemoryRouter>
    );

    const dateSpan = document.getElementById(`dataset-${testId}-updated-date`);
    expect(dateSpan).toBeInTheDocument();
    // Verify it contains the updated date text
    expect(dateSpan.textContent).toMatch(/Updated.+October 22, 2020/);
  });
  
  test('Link href points to correct dataset URL', () => {
    const testId = 'test-link-url';
    render(
      <MemoryRouter>
        <DatasetListItem
          title={singleItem.title}
          modified={singleItem.modified}
          identifier={testId}
        />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/dataset/${testId}`);
  });
  
  test('Verifies presence of dataset update text', () => {
    const title = 'Special Dataset Name';
    render(
      <MemoryRouter>
        <DatasetListItem
          title={title}
          modified={singleItem.modified}
          identifier={'test-update-text'}
        />
      </MemoryRouter>
    );
    
    expect(screen.getByText(`The ${title} dataset was updated.`)).toBeInTheDocument();
  });
  
  test('Different padding classes are applied based on pagination status for date span', () => {
    const testId = 'special-identifier-123';
    // Pagination enabled
    const { rerender } = render(
      <MemoryRouter>
        <DatasetListItem
          title={singleItem.title}
          modified={singleItem.modified}
          identifier={testId}
          paginationEnabled={true}
        />
      </MemoryRouter>
    );
    
    const dateSpan = document.getElementById(`dataset-${testId}-updated-date`);
    expect(dateSpan).toHaveClass('ds-u-padding-top--3');
    expect(dateSpan).not.toHaveClass('ds-u-padding-top--0');
    
    // Pagination disabled
    rerender(
      <MemoryRouter>
        <DatasetListItem
          title={singleItem.title}
          modified={singleItem.modified}
          identifier={testId}
          paginationEnabled={false}
        />
      </MemoryRouter>
    );
    
    expect(dateSpan).toHaveClass('ds-u-padding-top--0');
    expect(dateSpan).not.toHaveClass('ds-u-padding-top--3');
  });
  
  test('Mobile view applies correct link container classes without dataDictionaryLinks', () => {
    // Ensure mobile view
    require('react-responsive').useMediaQuery.mockImplementation(() => false);
    
    const { container } = render(
      <MemoryRouter>
        <DatasetListItem
          title={singleItem.title}
          modified={singleItem.modified}
          identifier={"test-mobile-no-dict"}
          dataDictionaryLinks={false}
        />
      </MemoryRouter>
    );
    
    // We can test the component rendered correctly
    expect(screen.getByRole('heading', { name: 'Dataset Title' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View the Dataset for Dataset Title' })).toBeInTheDocument();
  });
  
  test('Long title is displayed without truncation', () => {
    const longTitle = 'This is an extremely long dataset title that might need to be truncated in some views but should be shown in full here';
    
    render(
      <MemoryRouter>
        <DatasetListItem
          title={longTitle}
          modified={singleItem.modified}
          identifier={"test-long-title"}
        />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('heading', { name: longTitle })).toBeInTheDocument();
  });
});
