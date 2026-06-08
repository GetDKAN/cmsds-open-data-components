import React from 'react';
import { render } from '@testing-library/react';
import ApiDocsSwaggerUIPlugin from './index';

// Stub the heavier subcomponents — the factory's job is to produce the right
// shape and wire props through, not to render its internal renderers in full.
jest.mock('./ApiDocsInfo', () => () => <div data-testid="apidocs-info" />);
jest.mock('./OperationCompWrapperInner', () => (props: any) => (
  <div data-testid="opwrap" data-original={!!props.Original} />
));
jest.mock('./OperationTag', () => () => <div data-testid="operation-tag" />);
jest.mock('./OperationSummary', () => (props: any) => (
  <div data-testid="operation-summary" data-tryclass={props.tryItOutButtonClassNames} />
));
jest.mock('./ExecuteButton', () => (props: any) => (
  <button data-testid="execute-button" className={props.className} />
));
jest.mock('./ClearButton', () => (props: any) => (
  <button data-testid="clear-button" className={props.className} />
));
jest.mock('./Models', () => () => <div data-testid="models" />);

const makeSystem = (version = '1.0.0') => ({
  specSelectors: { version: () => version },
});

const Passthrough = (props: any) => <div data-testid="original" data-prop={props.foo} />;

describe('ApiDocsSwaggerUIPlugin', () => {
  it('returns a plugin object with wrapComponents + components keys', () => {
    const plugin = ApiDocsSwaggerUIPlugin({})(makeSystem());
    expect(plugin).toHaveProperty('wrapComponents');
    expect(plugin).toHaveProperty('components');
    expect(Object.keys(plugin.wrapComponents)).toEqual(
      expect.arrayContaining(['App', 'parameters', 'operation', 'execute', 'clear', 'VersionStamp']),
    );
    expect(Object.keys(plugin.components)).toEqual(
      expect.arrayContaining([
        'info',
        'OperationTag',
        'OperationSummary',
        'Models',
        'OperationSummaryMethod',
        'TryItOutButton',
      ]),
    );
    // The two no-op components return null
    expect((plugin.components as any).OperationSummaryMethod()).toBeNull();
    expect((plugin.components as any).TryItOutButton()).toBeNull();
  });

  it('wraps the App component in a swagger-ui-plugin container div', () => {
    const plugin = ApiDocsSwaggerUIPlugin({})(makeSystem());
    const WrappedApp = plugin.wrapComponents.App(Passthrough);
    const { container, getByTestId } = render(<WrappedApp foo="bar" />);
    expect(container.querySelector('#api-docs-swagger-ui-plugin.ds-l-container')).toBeInTheDocument();
    // The Original component is rendered inside with its props forwarded
    expect(getByTestId('original')).toHaveAttribute('data-prop', 'bar');
  });

  it('applies default button className when buttonClassNames is omitted', () => {
    const plugin = ApiDocsSwaggerUIPlugin({})(makeSystem());
    const Execute = plugin.wrapComponents.execute(Passthrough);
    const Clear = plugin.wrapComponents.clear(Passthrough);
    const { getByTestId, rerender } = render(<Execute />);
    expect(getByTestId('execute-button')).toHaveClass('ds-c-button', 'ds-c-button--solid', 'execute-button');
    rerender(<Clear />);
    expect(getByTestId('clear-button')).toHaveClass('ds-c-button', 'ds-u-margin-left--2', 'clear-button');
  });

  it('honors custom buttonClassNames overrides', () => {
    const plugin = ApiDocsSwaggerUIPlugin({
      buttonClassNames: {
        executeButton: 'custom-exec',
        clearButton: 'custom-clear',
        tryItOutButton: 'custom-try',
      },
    })(makeSystem());

    const Execute = plugin.wrapComponents.execute(Passthrough);
    const { getByTestId, rerender } = render(<Execute />);
    expect(getByTestId('execute-button')).toHaveClass('custom-exec');

    const Clear = plugin.wrapComponents.clear(Passthrough);
    rerender(<Clear />);
    expect(getByTestId('clear-button')).toHaveClass('custom-clear');

    // tryItOutButton flows through to OperationSummary as a separate prop
    const OperationSummary = (plugin.components as any).OperationSummary;
    rerender(<OperationSummary />);
    expect(getByTestId('operation-summary')).toHaveAttribute('data-tryclass', 'custom-try');
  });

  it('VersionStamp reads the version from system.specSelectors', () => {
    const plugin = ApiDocsSwaggerUIPlugin({})(makeSystem('3.1.4'));
    // VersionStamp wrapper is created with the same `system` reference
    const VersionStamp = plugin.wrapComponents.VersionStamp(Passthrough, makeSystem('3.1.4'));
    const { container } = render(<VersionStamp />);
    expect(container.querySelector('.version-stamp')?.textContent).toBe('3.1.4');
  });
});
