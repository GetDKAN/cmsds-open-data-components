import type { Preview } from '@storybook/react-vite'
import '@cmsgov/design-system/css/index.css';
import '@cmsgov/design-system/css/core-theme.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './font-awesome-overrides.css';
import { useEffect } from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9' }}>
    {children}
  </div>
);

// Decorator to replace Font Awesome Pro classes with Free equivalents
const FontAwesomeProToFree = (Story: any) => {
  useEffect(() => {
    // Inject critical CSS overrides to ensure they load last
    const styleId = 'fa-pro-to-free-overrides';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        /* Font Awesome Pro to Free critical overrides - injected last */
        .dkan-c-header-search--modal-button::before,
        .dkan-c-main-navigation--search .dkan-c-header-search--modal-button::before,
        button.dkan-c-header-search--modal-button::before {
          font-family: "Font Awesome 7 Free" !important;
          font-weight: 900 !important;
        }
        
        .dc-c-breadcrumb__list > li::after,
        nav.dc-c-breadcrumb .dc-c-breadcrumb__list > li::after,
        ol.dc-c-breadcrumb__list > li::after {
          font-family: "Font Awesome 7 Free" !important;
          font-weight: 900 !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Map of FA Pro classes to FA Free classes
    const proToFreeMap: { [key: string]: string } = {
      'far': 'fas', // Regular -> Solid (most Pro regular icons exist as Free solid)
      'fal': 'fas', // Light -> Solid
      'fad': 'fas', // Duotone -> Solid
      'fat': 'fas', // Thin -> Solid
    };

    // Specific icon mappings for Pro icons that don't exist in Free
    const iconReplacements: { [key: string]: string } = {
      'fa-circle-sort': 'fa-sort',
      'fa-circle-sort-up': 'fa-sort-up',
      'fa-circle-sort-down': 'fa-sort-down',
    };

    // Find all elements with FA Pro classes and replace them
    const replaceIcons = () => {
      const icons = document.querySelectorAll('[class*="fa-"]');
      icons.forEach((icon) => {
        const classList = Array.from(icon.classList);
        let modified = false;
        
        // Replace Pro style classes with Free equivalents
        classList.forEach((className) => {
          if (proToFreeMap[className]) {
            icon.classList.remove(className);
            icon.classList.add(proToFreeMap[className]);
            modified = true;
          }
          
          // Replace specific Pro-only icons with Free alternatives
          if (iconReplacements[className]) {
            icon.classList.remove(className);
            icon.classList.add(iconReplacements[className]);
            modified = true;
          }
        });

        // If we haven't found a style class, default to 'fas'
        const hasStyleClass = classList.some(c => ['fas', 'fab', 'far'].includes(c));
        const hasFaIcon = classList.some(c => c.startsWith('fa-') && c !== 'fa');
        
        if (!hasStyleClass && hasFaIcon) {
          icon.classList.add('fas');
        }
      });
    };

    // Run on mount
    replaceIcons();

    // Also run on DOM changes (for dynamically added icons)
    const observer = new MutationObserver(replaceIcons);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return <Story />;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

preview.decorators = [
  FontAwesomeProToFree,
  (Story) => (
    <Layout>
      <Story />
    </Layout>
  ),
];

export default preview;
