import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HeaderContext from '../../templates/Header/HeaderContext';
import SubMenu from './index';
import { NavLinkArray, SubmenuElementProps } from '../../types/misc';

type MockSubMenuStaticListProps = {
  submenuArray: NavLinkArray[];
  subLinkClasses: string;
};

jest.mock('../SubMenuStaticList', () => {
  return function MockSubMenuStaticList({ submenuArray, subLinkClasses }: MockSubMenuStaticListProps) {
    return (
      <ul data-testid="submenu-list" className="dkan-c-site-menu--sub-menu">
        {submenuArray.map((item: NavLinkArray) => (
          <li key={item.id}>
            <a href={item.url} className={subLinkClasses}>
              {item.icon ?? null}
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    );
  };
});

const mockHeaderContext = {
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  menuRef: null,
  isMobile: false,
  onDark: false,
};

const staticSubmenuLink: NavLinkArray = {
  id: 'resources',
  label: 'Resources',
  url: '/resources',
  submenu: [
    { id: 'datasets', label: 'Datasets', url: '/datasets' },
    { id: 'api', label: 'API', url: '/api' },
  ],
};

const externalSubmenuLink: NavLinkArray = {
  id: 'external',
  label: 'External',
  url: '/external',
  submenu: [
    { id: 'docs', label: 'Documentation', url: 'https://example.com/docs', external: true },
  ],
};

const renderSubMenu = (props = {}) => {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <HeaderContext.Provider value={mockHeaderContext}>
        <nav>
          <ul>
            <SubMenu
              link={staticSubmenuLink}
              linkClasses=""
              subLinkClasses=""
              wrapLabel={true}
              {...props}
            />
          </ul>
        </nav>
      </HeaderContext.Provider>
    </MemoryRouter>
  );
};

describe('<SubMenu />', () => {
  it('renders the menu button with the link label', () => {
    renderSubMenu();
    expect(screen.getByRole('button', { name: /Resources/i })).toBeInTheDocument();
  });

  it('sets aria-haspopup on the button', () => {
    renderSubMenu();
    expect(screen.getByRole('button', { name: /Resources/i })).toHaveAttribute('aria-haspopup', 'true');
  });

  it('starts with aria-expanded set to false', () => {
    renderSubMenu();
    expect(screen.getByRole('button', { name: /Resources/i })).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands the submenu on click', async () => {
    renderSubMenu();
    const button = screen.getByRole('button', { name: /Resources/i });

    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('collapses the submenu on second click', async () => {
    renderSubMenu();
    const button = screen.getByRole('button', { name: /Resources/i });

    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('adds the open class when expanded', async () => {
    renderSubMenu();
    const button = screen.getByRole('button', { name: /Resources/i });
    const listItem = button.closest('li');

    expect(listItem).not.toHaveClass('open');

    await userEvent.click(button);
    expect(listItem).toHaveClass('open');
  });

  it('renders static submenu links', async () => {
    renderSubMenu();
    await userEvent.click(screen.getByRole('button', { name: /Resources/i }));

    expect(screen.getByText('Datasets')).toBeInTheDocument();
    expect(screen.getByText('API')).toBeInTheDocument();
  });

  it('renders external links as anchor tags', async () => {
    renderSubMenu({ link: externalSubmenuLink });
    await userEvent.click(screen.getByRole('button', { name: /External/i }));

    const link = screen.getByText('Documentation').closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com/docs');
  });

  it('closes the submenu when clicking outside', async () => {
    renderSubMenu();
    const button = screen.getByRole('button', { name: /Resources/i });

    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    fireEvent.mouseDown(document.body);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('wraps the label in a span when wrapLabel is true', () => {
    renderSubMenu({ wrapLabel: true });
    const button = screen.getByRole('button', { name: /Resources/i });
    expect(button.querySelector('span')).toBeInTheDocument();
  });

  it('does not wrap the label in a span when wrapLabel is false', () => {
    renderSubMenu({ wrapLabel: false });
    const button = screen.getByRole('button', { name: /Resources/i });
    const spans = button.querySelectorAll('span');
    // The only span may be from ArrowIcon; the label text should not be in a span
    const labelSpan = Array.from(spans).find((s) => s.textContent === 'Resources');
    expect(labelSpan).toBeUndefined();
  });

  it('renders submenu items with icons when provided', async () => {
    const linkWithIcons = {
      label: 'Explore',
      submenu: [
        {
          id: 'datasets',
          label: 'Datasets',
          url: '/datasets',
          icon: <svg data-testid="submenu-icon" />,
        },
      ],
    };
    renderSubMenu({ link: linkWithIcons });
    await userEvent.click(screen.getByRole('button', { name: /Explore/i }));

    expect(screen.getByTestId('submenu-icon')).toBeInTheDocument();
  });

  describe('ReactElement submenu via cloneElement', () => {
    const CustomSubmenu = ({ subLinkClasses }: SubmenuElementProps) => (
      <ul data-testid="custom-submenu">
        <li className={subLinkClasses}>Custom item</li>
      </ul>
    );

    const reactElementSubmenuLink: NavLinkArray = {
      id: 'custom',
      label: 'Custom',
      url: '/custom',
      submenu: <CustomSubmenu />,
    };

    it('renders the custom ReactElement, not DatasetListSubmenu', async () => {
      renderSubMenu({ link: reactElementSubmenuLink });
      await userEvent.click(screen.getByRole('button', { name: /Custom/i }));

      expect(screen.getByTestId('custom-submenu')).toBeInTheDocument();
    });

    it('injects subLinkClasses into the cloned element', async () => {
      renderSubMenu({ link: reactElementSubmenuLink, subLinkClasses: 'my-link-class' });
      await userEvent.click(screen.getByRole('button', { name: /Custom/i }));

      expect(screen.getByText('Custom item')).toHaveClass('my-link-class');
    });

    it('does not render SubMenuStaticList when submenu is a ReactElement', async () => {
      renderSubMenu({ link: reactElementSubmenuLink });
      await userEvent.click(screen.getByRole('button', { name: /Custom/i }));

      expect(screen.queryByTestId('submenu-list')).not.toBeInTheDocument();
    });

    it('preserves original element props after cloneElement injects subLinkClasses', async () => {
      const PropPreservingSubmenu = ({
        subLinkClasses,
        'data-original': dataOriginal,
      }: SubmenuElementProps & { 'data-original'?: string }) => (
        <ul data-testid="prop-check" data-original={dataOriginal}>
          <li className={subLinkClasses}>Item</li>
        </ul>
      );

      const linkWithOriginalProp: NavLinkArray = {
        id: 'prop-test',
        label: 'PropTest',
        url: '/prop-test',
        submenu: <PropPreservingSubmenu data-original="preserved" />,
      };

      renderSubMenu({ link: linkWithOriginalProp, subLinkClasses: 'injected-class' });
      await userEvent.click(screen.getByRole('button', { name: /PropTest/i }));

      const list = screen.getByTestId('prop-check');
      expect(list).toHaveAttribute('data-original', 'preserved');
      expect(screen.getByText('Item')).toHaveClass('injected-class');
    });
  });
});
