import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FullScreenDataTable from './index';

jest.mock('../DatasetTableTab', () => () => <div data-testid="dataset-table" />);

describe('FullScreenDataTable', () => {
  it('returns null when isModal is true (no nested toggle)', () => {
    const { container } = render(<FullScreenDataTable isModal />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the toggle button labeled "Full Screen" when collapsed', () => {
    render(<FullScreenDataTable isModal={false} />);
    expect(screen.getByRole('button', { name: /full screen/i })).toBeInTheDocument();
  });

  it('opens the dialog and updates the button label after clicking', async () => {
    const user = userEvent.setup();
    render(<FullScreenDataTable isModal={false} />);
    await user.click(screen.getByRole('button', { name: /full screen/i }));
    expect(screen.getByRole('button', { name: /exit full screen/i })).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dataset-table')).toBeInTheDocument();
  });

  it('closes the dialog when the toggle is clicked again', async () => {
    const user = userEvent.setup();
    render(<FullScreenDataTable isModal={false} />);
    const toggle = screen.getByRole('button', { name: /full screen/i });
    await user.click(toggle);
    await user.click(screen.getByRole('button', { name: /exit full screen/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
