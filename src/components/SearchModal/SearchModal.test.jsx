import React from 'react';
import { renderWithProviders, screen, userEvent } from '../../tests/renderWithProviders';
import SearchModal from './index';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderModal = (props = {}) => renderWithProviders(<SearchModal {...props} />);

describe('SearchModal', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('does not show the dialog until the trigger is clicked', () => {
    renderModal();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the dialog on trigger click', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('writes typed text to the input', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: 'Search' }));
    const input = screen.getByLabelText('Search Term');
    await user.type(input, 'widgets');
    expect(input).toHaveValue('widgets');
  });

  it('navigates to /datasets on submit from a non-/datasets page', async () => {
    const user = userEvent.setup();
    const { container } = renderModal();
    await user.click(screen.getByRole('button', { name: 'Search' }));
    await user.type(screen.getByLabelText('Search Term'), 'apple');
    const submit = container.querySelector('button[type="submit"]');
    await user.click(submit);
    expect(mockNavigate).toHaveBeenCalledWith('/datasets?fulltext=apple');
  });

  it('uses the custom heading text when provided', async () => {
    const user = userEvent.setup();
    renderModal({ headingText: 'Find Sample Data' });
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByText('Find Sample Data')).toBeInTheDocument();
  });
});
