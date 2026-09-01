import React from 'react';
import { render, screen } from '@testing-library/react';
import ApiSchemaNotice from './index';

describe('ApiSchemaNotice', () => {
  it('renders the data.json endpoint change accordion', () => {
    render(<ApiSchemaNotice />);

    expect(screen.getByRole('button', { name: /change to the data.json endpoint/i })).toBeInTheDocument();
    expect(screen.getByText(/new DCAT-US v3\.0 standard starting from September 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/legacy DCAT-US 1\.1 catalog endpoint/i)).toBeInTheDocument();
  });
});
