import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === 'development') console.log(error, errorInfo);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full mt-40">
          <h1 className="mb-8 text-2xl text-gray-600">
            Oops, you have found a glitch in the matrix.
          </h1>
          <div className="space-x-8">
            <Button
              onClick={() => window.location.reload()}
              variant="contained"
            >
              Reload page
            </Button>
            <Button variant="contained" component={Link} to="/">
              Go home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
