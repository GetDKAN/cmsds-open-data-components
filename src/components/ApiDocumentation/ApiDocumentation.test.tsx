import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApiDocumentation from './index';

// swagger-ui-react is mocked out via jest.config.cjs moduleNameMapper to return ''.
// There's no meaningful DOM to assert against — this suite is a smoke test that
// the component composes its SwaggerUI plugins without throwing.
describe('ApiDocumentation', () => {
  it('mounts without crashing across the prop matrix', () => {
    const { rerender } = render(
      <ApiDocumentation
        endpoint="https://example.test/openapi.json"
        docsURL="https://example.test/docs"
        showRowLimitNotice={false}
      />,
    );
    rerender(
      <ApiDocumentation
        endpoint="https://example.test/openapi.json"
        docsURL="https://example.test/docs"
        showRowLimitNotice
        swaggerButtonClassNames={{ clear: 'custom-clear', execute: 'custom-exec' }}
      />,
    );
  });
});
