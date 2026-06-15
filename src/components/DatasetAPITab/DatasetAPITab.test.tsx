import React from 'react';
import { render, screen } from '@testing-library/react';
import { ACAContext } from '../../utilities/ACAContext';
import DatasetAPI from './index';

// Capture the props ApiDocumentation receives — DatasetAPI is a thin wrapper
// whose only responsibility is constructing the endpoint URL and forwarding props.
const capturedProps: any[] = [];
jest.mock('../ApiDocumentation', () => (props: any) => {
  capturedProps.push(props);
  return <div data-testid="api-documentation" />;
});

const wrapWithACA = (ui: React.ReactElement, ACA?: string) => (
  <ACAContext.Provider value={{ ACA }}>{ui}</ACAContext.Provider>
);

describe('DatasetAPI (DatasetAPITab)', () => {
  beforeEach(() => {
    capturedProps.length = 0;
  });

  it('constructs the docs endpoint from rootUrl + id and forwards apiUrl as docsURL', () => {
    render(
      wrapWithACA(
        <DatasetAPI
          id="dataset-001"
          rootUrl="https://example.test/api/1"
          apiUrl="https://example.test/api/1/docs"
        />,
      ),
    );
    expect(screen.getByTestId('api-documentation')).toBeInTheDocument();
    expect(capturedProps).toHaveLength(1);
    expect(capturedProps[0].endpoint).toBe(
      'https://example.test/api/1/metastore/schemas/dataset/items/dataset-001/docs?',
    );
    expect(capturedProps[0].docsURL).toBe('https://example.test/api/1/docs');
    // Defaults flow through unchanged
    expect(capturedProps[0].showRowLimitNotice).toBe(false);
    expect(capturedProps[0].swaggerButtonClassNames).toEqual({});
  });

  it('appends the ACA query parameter when ACA context is set', () => {
    render(
      wrapWithACA(
        <DatasetAPI
          id="dataset-001"
          rootUrl="https://example.test/api/1"
          apiUrl="https://example.test/api/1/docs"
        />,
        'cms-aca-token-abc',
      ),
    );
    expect(capturedProps[0].endpoint).toContain('ACA=cms-aca-token-abc');
    expect(capturedProps[0].endpoint).toContain('redirect=false');
  });

  it('passes showRowLimitNotice and swaggerButtonClassNames through', () => {
    const buttonClassNames = { tryItOutButton: 'custom-try-it', executeButton: 'custom-exec' };
    render(
      wrapWithACA(
        <DatasetAPI
          id="dataset-001"
          rootUrl="https://example.test/api/1"
          apiUrl="https://example.test/api/1/docs"
          showRowLimitNotice
          swaggerButtonClassNames={buttonClassNames}
        />,
      ),
    );
    expect(capturedProps[0].showRowLimitNotice).toBe(true);
    expect(capturedProps[0].swaggerButtonClassNames).toBe(buttonClassNames);
  });
});
