import type { Meta, StoryObj } from '@storybook/react';
import SpecsAndLimits from './index';

const meta: Meta<typeof SpecsAndLimits> = {
  title: 'Templates/SpecsAndLimits',
  component: SpecsAndLimits,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The SpecsAndLimits template displays a page about software specifications and limitations for working with large datasets.
It includes a table of documentation links for various applications (Excel, Access, Oracle, etc.) and allows custom content override via the children prop.
        `,
      },
    },
  },
  argTypes: {
    documentationList: {
      control: 'object',
      description: 'Array of documentation objects with id, application, notes, link, linkText, and screenReaderOnlyText properties. Defaults to built-in documentation data.',
    },
    children: {
      control: false,
      description: 'Optional custom JSX content to replace the default introductory text about large datasets.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SpecsAndLimits>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default specs and limits page with built-in documentation for Microsoft Excel, Access, Oracle SQL Developer, Oracle Database, and Oracle SQL Client Tools.'
      }
    }
  }
};

export const WithCustomContent: Story = {
  args: {
    children: (
      <>
        <h2 className="ds-text-heading--xl">Custom Introduction</h2>
        <p>
          This is custom content that replaces the default introductory text about large datasets.
          You can include any JSX elements here to customize the page introduction.
        </p>
        <p>
          Our datasets are available in multiple formats and sizes. Please review the
          documentation below to ensure your tools can handle the file sizes and row counts.
        </p>
        <ul>
          <li>CSV format: Best for general use</li>
          <li>JSON format: Best for API integration</li>
          <li>Parquet format: Best for large-scale analytics</li>
        </ul>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with custom content in the children prop to override the default introductory text. The documentation table still uses the default data.'
      }
    }
  }
};
