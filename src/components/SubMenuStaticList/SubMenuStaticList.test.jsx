import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SubMenuStaticList from './index';

const buildItems = () => [
  { id: '1', label: 'Internal', url: '/internal' },
  { id: '2', label: 'External', url: 'https://example.test/external', external: true },
  { id: '3', label: 'Drupal Page', url: '/drupal', drupalPage: true },
];

const renderList = (props = {}) =>
  render(
    <MemoryRouter>
      <SubMenuStaticList
        submenuArray={buildItems()}
        subLinkClasses="custom-link-class"
        setIsExpanded={jest.fn()}
        {...props}
      />
    </MemoryRouter>,
  );

describe('SubMenuStaticList', () => {
  it('renders every submenu item', () => {
    renderList();
    expect(screen.getByText('Internal')).toBeInTheDocument();
    expect(screen.getByText('External')).toBeInTheDocument();
    expect(screen.getByText('Drupal Page')).toBeInTheDocument();
  });

  it('uses a plain <a> for external and drupalPage entries', () => {
    renderList();
    const external = screen.getByText('External').closest('a');
    const drupal = screen.getByText('Drupal Page').closest('a');
    expect(external).toHaveAttribute('href', 'https://example.test/external');
    expect(drupal).toHaveAttribute('href', '/drupal');
  });

  it('applies subLinkClasses to every link', () => {
    renderList();
    expect(screen.getByText('Internal').closest('a')).toHaveClass('custom-link-class');
    expect(screen.getByText('External').closest('a')).toHaveClass('custom-link-class');
  });

  it('calls setIsExpanded when an internal NavLink is clicked', async () => {
    const user = userEvent.setup();
    const setIsExpanded = jest.fn();
    renderList({ setIsExpanded });
    await user.click(screen.getByText('Internal'));
    expect(setIsExpanded).toHaveBeenCalled();
  });
});
