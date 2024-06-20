import React from 'react';

type ErrorBoundaryProps = {
  children: any[] | any;
  component?: boolean;
  Layout?: any;
}

type ErrorBoundaryState = {
  hasError: boolean;
  error?: any;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // TODO report to logging solution
    console.error({ error, info });
  }

  render() {
    if (this.props.component) {
      if (this.state.hasError) {
        return (
          <>
            <p>We're sorry, the site has encountered an unexpected error.</p>
          </>
        );
      }
      return this.props.children;
    }

    return (
      <>
        <div className="ds-l-container">
          <h2 className="ds-text-heading--2xl">Error</h2>
          <p>We're sorry, the site has encountered an unexpected error.</p>
        </div>
      </>
    );
  }
}

export default ErrorBoundary;
