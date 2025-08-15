import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import LargeFileDialog from './index';

describe("<LargeFileDialog />", () => {
  test('Renders correctly', () => {
    render(<LargeFileDialog downloadUrl="test" />);
    expect(screen.getByRole('button', { name: "Download" }));
  });
  test('Opens and Closes correctly', () => {
    window.scrollTo = jest.fn();
    
    render(<LargeFileDialog downloadUrl="test" />);

    fireEvent.click(screen.getByRole('button', { name: "Download" }));
    expect(screen.getByRole('link', { name: "Yes, download" }));
    
    fireEvent.click(screen.getByRole('button', { name: "Close modal dialog" }));
    expect(screen.queryByRole('link', { name: "Yes, download" })).not.toBeInTheDocument();
  });
})