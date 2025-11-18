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

/**
 * Decorator to handle Font Awesome Pro to Free conversions
 * 
 * This decorator does two things:
 * 1. Injects CSS overrides dynamically to ensure they load AFTER component SCSS
 * 2. Replaces Pro style classes (far, fal, fad, fat) with fas (solid)
 */
const FontAwesomeProToFree = (Story: any) => {
  useEffect(() => {
    // Inject CSS overrides to ensure they load after component SCSS
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
        
        /* Global catch-all for all dkan/dc prefixed pseudo-elements */
        *[class*="dkan-"]::before,
        *[class*="dkan-"]::after,
        *[class*="dc-"]::before,
        *[class*="dc-"]::after {
          font-family: "Font Awesome 7 Free" !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Replace Pro style classes with Free equivalents
    const replaceIconClasses = () => {
      const icons = document.querySelectorAll('.far, .fal, .fad, .fat');
      icons.forEach((icon) => {
        if (icon.classList.contains('far')) {
          icon.classList.remove('far');
          icon.classList.add('fas');
        }
        if (icon.classList.contains('fal')) {
          icon.classList.remove('fal');
          icon.classList.add('fas');
        }
        if (icon.classList.contains('fad')) {
          icon.classList.remove('fad');
          icon.classList.add('fas');
        }
        if (icon.classList.contains('fat')) {
          icon.classList.remove('fat');
          icon.classList.add('fas');
        }
      });
    };

    // Run on mount
    replaceIconClasses();

    // Also run on DOM changes (for dynamically added icons)
    const observer = new MutationObserver(replaceIconClasses);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
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
