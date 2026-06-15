import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResourceHeader from './index';

jest.mock('../DataTablePageResults', () => () => <div data-testid="page-results" />);
jest.mock('../DataTableDensity', () => () => <div data-testid="density" />);
jest.mock('../DataTableRowChanger', () => () => <div data-testid="row-changer" />);

const baseResource = {
  count: 100,
  limit: 25,
  offset: 0,
  loading: false,
  setLimit: jest.fn(),
  setOffset: jest.fn(),
};

const renderHeader = (overrides = {}) =>
  render(
    <ResourceHeader
      setTablePadding={() => {}}
      includeDensity
      includeDownload
      resource={baseResource}
      tablePadding="normal"
      downloadUrl="https://example.test/data/sales.csv"
      {...overrides}
    />,
  );

describe('ResourceHeader', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn() },
    });
  });

  it('renders DataTablePageResults when data is loaded', () => {
    renderHeader();
    expect(screen.getByTestId('page-results')).toBeInTheDocument();
  });

  it('hides DataTablePageResults while loading', () => {
    renderHeader({ resource: { ...baseResource, loading: true } });
    expect(screen.queryByTestId('page-results')).not.toBeInTheDocument();
  });

  it('hides DataTablePageResults when count is null', () => {
    renderHeader({ resource: { ...baseResource, count: null } });
    expect(screen.queryByTestId('page-results')).not.toBeInTheDocument();
  });

  it('renders the download button pointing at downloadUrl when includeDownload', () => {
    renderHeader();
    const download = screen.getByRole('link', { name: /download filtered data/i });
    expect(download).toHaveAttribute('href', 'https://example.test/data/sales.csv');
  });

  it('omits the download button when includeDownload is false', () => {
    renderHeader({ includeDownload: false });
    expect(screen.queryByRole('link', { name: /download filtered data/i })).not.toBeInTheDocument();
  });

  // fireEvent.click — userEvent.setup() v14 installs its own clipboard stub that
  // would clobber the jest.fn we install in beforeEach. fireEvent skips the
  // pointer subsystem entirely, leaving our spy intact for the Tooltip onOpen callback.
  it('copies the location to the clipboard when the copy tooltip opens', () => {
    renderHeader();
    const copyButton = screen.getByRole('button', { name: /copy link to filtered data/i });
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);
  });
});
