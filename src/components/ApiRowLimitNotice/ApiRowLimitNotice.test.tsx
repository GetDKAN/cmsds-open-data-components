import React from 'react';
import { render, screen } from '@testing-library/react';
import ApiRowLimitNotice from './index';

describe('ApiRowLimitNotice', () => {
  it('renders the Row Limit Warning accordion heading', () => {
    render(<ApiRowLimitNotice />);
    expect(screen.getByRole('button', { name: /row limit warning/i })).toBeInTheDocument();
  });
});
