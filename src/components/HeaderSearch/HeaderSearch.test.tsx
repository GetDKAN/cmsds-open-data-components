import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import HeaderSearch from './index';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderHeaderSearch = () =>
  render(
    <MemoryRouter>
      <HeaderSearch />
    </MemoryRouter>,
  );

describe('HeaderSearch', () => {
  // jsdom defaults window.location.pathname to '/', which is the non-/datasets
  // branch — exactly what we want for these cases.
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('does not render the dialog before the trigger is clicked', () => {
    renderHeaderSearch();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the dialog when the trigger is clicked', async () => {
    const user = userEvent.setup();
    renderHeaderSearch();
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('navigates to /datasets when submitting a valid term from another page', async () => {
    const user = userEvent.setup();
    const { container } = renderHeaderSearch();
    await user.click(screen.getByRole('button', { name: 'Search' }));
    await user.type(screen.getByLabelText('Search Term'), 'widgets');
    const submit = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    await user.click(submit);
    expect(mockNavigate).toHaveBeenCalledWith('/datasets?fulltext=widgets');
  });

  it('shows the validation error for queries with special characters', async () => {
    const user = userEvent.setup();
    const { container } = renderHeaderSearch();
    await user.click(screen.getByRole('button', { name: 'Search' }));
    await user.type(screen.getByLabelText('Search Term'), 'bad$query');
    const submit = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    await user.click(submit);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(
      screen.getByText('No special characters allowed. Please enter a valid search term.'),
    ).toBeInTheDocument();
  });
});
