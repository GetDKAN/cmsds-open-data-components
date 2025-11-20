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
 * Replaces Pro icon classes with Free equivalents at runtime.
 * CSS overrides are loaded via font-awesome-overrides.css import.
 */
const FontAwesomeProToFree = (Story: any) => {
  useEffect(() => {
    const replaceIconClasses = () => {
      // Pro weight classes → solid
      document.querySelectorAll('.far, .fal, .fad, .fat').forEach((icon) => {
        icon.classList.remove('far', 'fal', 'fad', 'fat');
        icon.classList.add('fas');
      });

      // Pro icon names → Free equivalents
      document.querySelectorAll('.fa-file-xls').forEach((icon) => {
        icon.classList.replace('fa-file-xls', 'fa-file-excel');
      });
    };

    replaceIconClasses();

    // Watch for dynamically added icons
    const observer = new MutationObserver(replaceIconClasses);
    observer.observe(document.body, { childList: true, subtree: true });

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
