import React from 'react';
import { axe } from 'jest-axe';
import { renderWithProviders, screen, userEvent } from '../../tests/renderWithProviders';
import Hero from './index';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderHero = (props = {}) =>
  renderWithProviders(<Hero title="Sample Title" description="Sample description" {...props} />);

describe('Hero', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('renders title and description', () => {
    renderHero();
    expect(screen.getByRole('heading', { name: 'Sample Title' })).toBeInTheDocument();
    expect(screen.getByText('Sample description')).toBeInTheDocument();
  });

  it('navigates to searchUrl with the entered query on submit', async () => {
    const user = userEvent.setup();
    renderHero();
    await user.type(screen.getByLabelText('Search for a dataset'), 'widgets');
    await user.click(screen.getByRole('button', { name: /search/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/datasets?fulltext=widgets');
  });

  it('shows an error and does not navigate when the query has special characters', async () => {
    const user = userEvent.setup();
    renderHero();
    await user.type(screen.getByLabelText('Search for a dataset'), 'bad$query');
    await user.click(screen.getByRole('button', { name: /search/i }));
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(
      screen.getByText('No special characters allowed. Please enter a valid search term.'),
    ).toBeInTheDocument();
  });

  it('uses custom searchUrl and searchKey props', async () => {
    const user = userEvent.setup();
    renderHero({ searchUrl: 'catalog', searchKey: 'q', searchButtonText: 'Go' });
    await user.type(screen.getByLabelText('Search for a dataset'), 'apple');
    await user.click(screen.getByRole('button', { name: /go/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/catalog?q=apple');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = renderHero();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
