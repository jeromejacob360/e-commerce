import { Button } from '@mui/material';
import React from 'react';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="mb-4 text-2xl text-gray-600">Invalid product id.</h1>
          <Button onClick={() => window.location.reload()} variant="contained">
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
