import type { Preview } from '@storybook/react-vite'
import '@cmsgov/design-system/css/index.css';
import '@cmsgov/design-system/css/core-theme.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9' }}>
    {children}
  </div>
);

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
  (Story) => (
    <Layout>
      <Story />
    </Layout>
  ),
];

export default preview;