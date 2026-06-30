import type { Preview } from '@storybook/react-vite'
import '@cmsgov/design-system/css/index.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './font-awesome-overrides.css';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { handlers } from './mswHandlers';

// CMS Design System theme files — each is a single :root { --var: ... } block
// of CSS custom-property overrides on top of the shared base in `index.css`.
// `?inline` returns the file content as a string; we inject the active theme
// into a single <style> element and swap it when the toolbar selector changes.
import coreTheme from '@cmsgov/design-system/css/core-theme.css?inline';
import healthcareTheme from '@cmsgov/ds-healthcare-gov/css/healthcare-theme.css?inline';
import medicareTheme from '@cmsgov/ds-medicare-gov/css/medicare-theme.css?inline';
import cmsgovTheme from '@cmsgov/ds-cms-gov/css/cmsgov-theme.css?inline';

initialize({
  onUnhandledRequest: 'warn',
}, handlers);

const THEME_STYLE_ID = 'cmsds-active-theme';
const themes: Record<string, string> = {
  core: coreTheme,
  healthcare: healthcareTheme,
  medicare: medicareTheme,
  cmsgov: cmsgovTheme,
};

const applyTheme = (theme: string) => {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(THEME_STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = THEME_STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = themes[theme] ?? themes.core;
};

// Apply the default theme synchronously at module load so the first paint
// matches the toolbar default — avoids a flash of un-themed content.
applyTheme('core');

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

// Swap the active CMS DS theme based on the toolbar global. Side-effect during
// render is safe here — applyTheme is idempotent and only mutates the single
// <style id="cmsds-active-theme"> element.
const themeDecorator = (Story: React.FC, context: { globals?: { theme?: string } }) => {
  applyTheme(context.globals?.theme ?? 'core');
  return <Story />;
};

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'CMS Design System theme',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'core', title: 'Core' },
          { value: 'healthcare', title: 'Healthcare.gov' },
          { value: 'medicare', title: 'Medicare.gov' },
          { value: 'cmsgov', title: 'CMS.gov' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'core',
  },
  parameters: {
    options: {
      storySort: {
        order: ['Introduction', 'Templates', 'Components', '*'],
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  loaders: [mswLoader],
};

preview.decorators = [themeDecorator, layoutDecorator];

export default preview;
