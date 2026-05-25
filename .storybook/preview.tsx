import type { Preview } from '@storybook/react-vite'
import '@cmsgov/design-system/css/index.css';
import '@cmsgov/design-system/css/core-theme.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './font-awesome-overrides.css';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { handlers } from './mswHandlers';

initialize({
  onUnhandledRequest: 'warn',
}, handlers);

// Convert Pro icon classes to Free equivalents at runtime.
// Set up once at module load; the observer catches dynamically rendered icons.
const replaceIconClasses = () => {
  document.querySelectorAll('.far, .fal, .fad, .fat').forEach((icon) => {
    icon.classList.remove('far', 'fal', 'fad', 'fat');
    icon.classList.add('fas');
  });
  document.querySelectorAll('.fa-file-xls').forEach((icon) => {
    icon.classList.replace('fa-file-xls', 'fa-file-excel');
  });
};

if (typeof document !== 'undefined') {
  if (document.body) {
    replaceIconClasses();
    new MutationObserver(replaceIconClasses).observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      replaceIconClasses();
      new MutationObserver(replaceIconClasses).observe(document.body, { childList: true, subtree: true });
    });
  }
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
    {children}
  </div>
);

// Skip the Layout wrapper for stories declaring layout: 'fullscreen' so templates
// (Dataset, FilteredResource, Header, etc.) actually render full-bleed.
const layoutDecorator = (Story: React.FC, context: { parameters?: { layout?: string } }) => {
  if (context.parameters?.layout === 'fullscreen') {
    return <Story />;
  }
  return (
    <Layout>
      <Story />
    </Layout>
  );
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
  loaders: [mswLoader],
};

preview.decorators = [layoutDecorator];

export default preview;
