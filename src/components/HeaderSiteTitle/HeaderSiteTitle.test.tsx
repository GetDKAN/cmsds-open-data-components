import React from 'react';
import { renderWithProviders, screen } from '../../tests/renderWithProviders';
import HeaderSiteTitle from './index';

const orgWithLogo = {
  logoFilePath: '/logo.svg',
  logoAltText: 'Sample logo',
  urlTitle: 'Sample Data Portal',
};

const orgTextOnly = {
  logoFilePath: '',
  logoAltText: '',
  urlTitle: 'Sample Data Portal',
};

describe('HeaderSiteTitle', () => {
  it('renders the logo image link when logoFilePath is set', () => {
    renderWithProviders(<HeaderSiteTitle org={orgWithLogo as any} />);
    expect(screen.getByAltText('Sample logo')).toHaveAttribute('src', '/logo.svg');
    expect(screen.queryByText('Sample Data Portal')).not.toBeInTheDocument();
  });

  it('falls back to the text title and applies inverse class when inverse is true', () => {
    renderWithProviders(<HeaderSiteTitle org={orgTextOnly as any} inverse />);
    const link = screen.getByRole('link', { name: 'Sample Data Portal' });
    expect(link).toHaveClass('ds-c-link--inverse');
  });

  it('omits the inverse class when inverse is false/undefined', () => {
    renderWithProviders(<HeaderSiteTitle org={orgTextOnly as any} />);
    const link = screen.getByRole('link', { name: 'Sample Data Portal' });
    expect(link).not.toHaveClass('ds-c-link--inverse');
  });
});
