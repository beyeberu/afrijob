import { Component } from 'react';
import PropTypes from 'prop-types';
import './ErrorBoundary.css'; // Optional: Create this for styling

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      reloadAttempts: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { 
      hasError: true,
      error 
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Update state with error details
    this.setState({ errorInfo });

    // Log to an error tracking service (e.g., Sentry, LogRocket)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRefresh = () => {
    if (this.state.reloadAttempts < 3) {
      this.setState(prevState => ({ 
        reloadAttempts: prevState.reloadAttempts + 1,
        hasError: false,
        error: null,
        errorInfo: null
      }));
    } else {
      window.location.reload();
    }
  };

  renderErrorDetails() {
    if (!this.props.debug) return null;

    return (
      <details className="error-details">
        <summary>Error Details</summary>
        <pre>{this.state.error?.toString()}</pre>
        <pre>{this.state.errorInfo?.componentStack}</pre>
      </details>
    );
  }

  renderFallback() {
    if (this.props.fallback) {
      return this.props.fallback({
        error: this.state.error,
        errorInfo: this.state.errorInfo,
        reloadAttempts: this.state.reloadAttempts,
        handleRefresh: this.handleRefresh
      });
    }

    return (
      <div className="error-boundary">
        <div className="error-content">
          <h2>Oops! Something went wrong.</h2>
          <p>We've encountered an unexpected error.</p>
          
          {this.props.customMessage || (
            <p>Our team has been notified and we're working on a fix.</p>
          )}

          <div className="error-actions">
            <button 
              onClick={this.handleRefresh}
              disabled={this.state.reloadAttempts >= 3}
            >
              {this.state.reloadAttempts < 3 ? 'Try Again' : 'Reload Page'}
            </button>
            
            {this.props.contactSupport && (
              <button onClick={this.props.contactSupport}>
                Contact Support
              </button>
            )}
          </div>

          {this.renderErrorDetails()}
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  debug: PropTypes.bool, // Enable detailed error info in development
  customMessage: PropTypes.node, // Custom error message
  contactSupport: PropTypes.func, // Function to contact support
  onError: PropTypes.func, // Callback for error reporting
  fallback: PropTypes.func // Custom fallback component
};

ErrorBoundary.defaultProps = {
  debug: process.env.NODE_ENV === 'development',
  customMessage: null,
  contactSupport: null,
  onError: null,
  fallback: null
};

export default ErrorBoundary;