import React from 'react';
import { renderWithProviders, screen } from '../../tests/renderWithProviders';
import Footer from './index';

// Stub NavLink so footer tests focus on Footer's own conditional logic.
jest.mock('../../components/NavLink', () => (props) => (
  <a href={props.link.url} data-testid={`navlink-${props.link.id}`}>
    {props.link.label}
  </a>
));

const baseLinks = {
  footerOpenDataToolLinks: [
    { id: 'tool-search', label: 'Search', url: '/search' },
  ],
  footerAdditionalResourcesLinks: [
    { id: 'plain', label: 'Plain', url: '/plain' },
    {
      id: 'tagged',
      label: 'Tagged',
      url: '/tagged',
      onClick: jest.fn(),
      dataTag: { name: 'analytics', value: 'footer-cta' },
    },
    // Has onClick but no dataTag — filter rule drops this one.
    { id: 'dropped', label: 'Dropped', url: '/dropped', onClick: jest.fn() },
  ],
  footerUtilityLinks: [
    { id: 'privacy', label: 'Privacy', url: '/privacy' },
  ],
};

const baseProps = {
  links: baseLinks,
  hhsLogo: '/hhs.svg',
  cmsLogo: '/cms.svg',
  emailLink: 'https://example.test/signup',
  trademarkContent: <div data-testid="trademark">Trademark text</div>,
};

describe('Footer', () => {
  it('renders the email-signup section by default and omits it when showEmail is false', () => {
    const { rerender } = renderWithProviders(<Footer {...baseProps} />);
    expect(screen.getByRole('heading', { name: 'Get Email Updates' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Sign up for email updates' }),
    ).toHaveAttribute('href', 'https://example.test/signup');

    rerender(<Footer {...baseProps} showEmail={false} />);
    expect(screen.queryByRole('heading', { name: 'Get Email Updates' })).not.toBeInTheDocument();
  });

  it('filters additionalResourcesLinks: keeps plain + onClick-with-dataTag, drops onClick-without-dataTag', () => {
    renderWithProviders(<Footer {...baseProps} />);
    // Plain link → rendered via mocked NavLink
    expect(screen.getByTestId('navlink-plain')).toBeInTheDocument();
    // onClick + dataTag → rendered as raw <a> with data-analytics attribute, not NavLink
    const tagged = screen.getByRole('link', { name: 'Tagged' });
    expect(tagged).toHaveAttribute('href', '/tagged');
    expect(tagged).toHaveAttribute('data-analytics', 'footer-cta');
    expect(screen.queryByTestId('navlink-tagged')).not.toBeInTheDocument();
    // onClick without dataTag → filtered out entirely
    expect(screen.queryByText('Dropped')).not.toBeInTheDocument();
  });

  it('renders social-media icons only for platforms with a url present', () => {
    const { container, rerender } = renderWithProviders(
      <Footer
        {...baseProps}
        socialMediaLinks={{
          facebook: { url: 'https://example.test/fb', title: 'Sample FB' },
          // twitter object lacks url → icon skipped
          twitter: { title: 'Sample TW' },
          linkedin: { url: 'https://example.test/li' },
        }}
      />,
    );
    expect(screen.getByRole('link', { name: /sample fb/i })).toHaveAttribute(
      'href',
      'https://example.test/fb',
    );
    // LinkedIn has url but no custom title → falls back to default
    expect(container.querySelector('a[href="https://example.test/li"]')).toBeInTheDocument();
    // Twitter lacks url → not rendered
    expect(screen.queryByText('Sample TW')).not.toBeInTheDocument();

    // Without socialMediaLinks at all → no icons section
    rerender(<Footer {...baseProps} />);
    expect(screen.queryByRole('link', { name: /sample fb/i })).not.toBeInTheDocument();
  });
});
