import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HeaderSearch from './index';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@cmsgov/design-system', () => ({
  Button: ({ children, onClick, className, type, onDark, variation }) => (
    <button onClick={onClick} className={className} type={type}>
      {children}
    </button>
  ),
  Dialog: ({ heading, actions, onExit, isOpen }) => (
    <div data-testid="search-dialog">
      <h2>{heading}</h2>
      <button onClick={onExit} aria-label="Close dialog">
        Close
      </button>
      <div>{actions}</div>
    </div>
  ),
  TextField: ({ label, onChange, value, name, labelClassName, errorMessage }) => (
    <div>
      <label className={labelClassName} htmlFor={name}>
        {label}
      </label>
      <input id={name} name={name} value={value} onChange={onChange} aria-label={label} />
      {errorMessage && <span role="alert">{errorMessage}</span>}
    </div>
  ),
}));

const renderHeaderSearch = (props = {}) =>
  render(
    <MemoryRouter>
      <HeaderSearch {...props} />
    </MemoryRouter>
  );

describe('<HeaderSearch />', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the Search button', () => {
    renderHeaderSearch();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  it('modal is not visible on initial render', () => {
    renderHeaderSearch();
    expect(screen.queryByTestId('search-dialog')).not.toBeInTheDocument();
  });

  it('opens the modal when the Search button is clicked', async () => {
    renderHeaderSearch();
    await userEvent.click(screen.getByRole('button', { name: /^Search$/i }));
    expect(screen.getByTestId('search-dialog')).toBeInTheDocument();
  });

  it('closes the modal via the onExit callback', async () => {
    renderHeaderSearch();
    await userEvent.click(screen.getByRole('button', { name: /^Search$/i }));
    expect(screen.getByTestId('search-dialog')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Close dialog/i }));
    expect(screen.queryByTestId('search-dialog')).not.toBeInTheDocument();
  });

  describe('search form submission', () => {
    it('navigates to /datasets with the search term when not on /datasets', async () => {
      renderHeaderSearch();
      await userEvent.click(screen.getByRole('button', { name: /^Search$/i }));

      await userEvent.type(screen.getByRole('textbox', { name: /Search Term/i }), 'cancer');
      fireEvent.submit(screen.getByRole('textbox', { name: /Search Term/i }).closest('form'));

      expect(mockNavigate).toHaveBeenCalledWith('/datasets?fulltext=cancer');
    });

    it('closes the modal after navigating to /datasets', async () => {
      renderHeaderSearch();
      await userEvent.click(screen.getByRole('button', { name: /^Search$/i }));

      await userEvent.type(screen.getByRole('textbox', { name: /Search Term/i }), 'cancer');
      fireEvent.submit(screen.getByRole('textbox', { name: /Search Term/i }).closest('form'));

      expect(screen.queryByTestId('search-dialog')).not.toBeInTheDocument();
    });

    it('shows a validation error for an invalid search term', async () => {
      renderHeaderSearch();
      await userEvent.click(screen.getByRole('button', { name: /^Search$/i }));

      await userEvent.type(screen.getByRole('textbox', { name: /Search Term/i }), '!!!');
      fireEvent.submit(screen.getByRole('textbox', { name: /Search Term/i }).closest('form'));

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
