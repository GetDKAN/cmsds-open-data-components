import React from 'react';
import { render, screen } from '@testing-library/react';
import { ACAContext } from '../../utilities/ACAContext';
import APIPage from './index';

// SwaggerUI is a heavy third-party renderer; we only verify the URL we hand it.
// Mocking it lets us read the constructed URL via a test id.
jest.mock('swagger-ui-react', () => (props: any) => (
  <div data-testid="swagger-ui" data-url={props.url} />
));

describe('APIPage', () => {
  it('renders SwaggerUI with the rootUrl and hideAuth=true by default', () => {
    render(
      <ACAContext.Provider value={{ ACA: undefined }}>
        <APIPage rootUrl="https://example.test/api/1/openapi.json" />
      </ACAContext.Provider>,
    );
    const ui = screen.getByTestId('swagger-ui');
    // Default hideAuth=true → authentication=false param is serialized; hideAuth=false omits it.
    expect(ui.getAttribute('data-url')).toBe(
      'https://example.test/api/1/openapi.json?authentication=false',
    );
  });

  it('omits authentication param when hideAuth is false', () => {
    render(
      <ACAContext.Provider value={{ ACA: undefined }}>
        <APIPage rootUrl="https://example.test/api/1/openapi.json" hideAuth={false} />
      </ACAContext.Provider>,
    );
    expect(screen.getByTestId('swagger-ui').getAttribute('data-url')).toBe(
      'https://example.test/api/1/openapi.json',
    );
  });
});
