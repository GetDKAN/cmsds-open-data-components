import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SearchModal from './index';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-responsive', () => ({
  useMediaQuery: jest.fn(() => false),
}));

jest.mock('@cmsgov/design-system', () => ({
  Button: ({ children, onClick, className, type, onDark, variation, size }) => (
    <button onClick={onClick} className={className} type={type}>
      {children}
    </button>
  ),
  Dialog: ({ heading, actions, onExit }) => (
    <div data-testid="search-dialog">
      <h2>{heading}</h2>
      <button onClick={onExit} aria-label="Close dialog">
        Close
      </button>
      <div>{actions}</div>
    </div>
  ),
  TextField: ({ label, onChange, value, name, labelClassName }) => (
    <div>
      <label className={labelClassName} htmlFor={name}>
        {label}
      </label>
      <input id={name} name={name} value={value} onChange={onChange} aria-label={label} />
    </div>
  ),
}));

const renderSearchModal = (props = {}) =>
  render(
    <MemoryRouter>
      <SearchModal {...props} />
    </MemoryRouter>
  );

describe('<SearchModal />', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the Search button', () => {
    renderSearchModal();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  it('modal is not visible on initial render', () => {
    renderSearchModal();
    expect(screen.queryByTestId('search-dialog')).not.toBeInTheDocument();
  });

  it('opens the modal when the Search button is clicked', async () => {
    renderSearchModal();
    await userEvent.click(screen.getByRole('button', { name: /^Search$/i }));
    expect(screen.getByTestId('search-dialog')).toBeInTheDocument();
  });

  it('renders the heading inside the modal', async () => {
    renderSearchModal({ headingText: 'Find Datasets' });
    await userEvent.click(screen.getByRole('button', { name: /^Search$/i }));
    expect(screen.getByRole('heading', { name: 'Find Datasets' })).toBeInTheDocument();
  });

  it('closes the modal via the onExit callback', async () => {
    renderSearchModal();
    await userEvent.click(screen.getByRole('button', { name: /^Search$/i }));
    expect(screen.getByTestId('search-dialog')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Close dialog/i }));
    expect(screen.queryByTestId('search-dialog')).not.toBeInTheDocument();
  });

  describe('search form submission', () => {
    it('navigates to /datasets with the search term when not on /datasets', async () => {
      renderSearchModal();
      await userEvent.click(screen.getByRole('button', { name: /^Search$/i }));

      await userEvent.type(screen.getByRole('textbox', { name: /Search Term/i }), 'cancer');
      fireEvent.submit(screen.getByRole('textbox', { name: /Search Term/i }).closest('form'));

      expect(mockNavigate).toHaveBeenCalledWith('/datasets?fulltext=cancer');
    });

    it('closes the modal after navigating to /datasets', async () => {
      renderSearchModal();
      await userEvent.click(screen.getByRole('button', { name: /^Search$/i }));

      await userEvent.type(screen.getByRole('textbox', { name: /Search Term/i }), 'cancer');
      fireEvent.submit(screen.getByRole('textbox', { name: /Search Term/i }).closest('form'));

      expect(screen.queryByTestId('search-dialog')).not.toBeInTheDocument();
    });
  });
});
