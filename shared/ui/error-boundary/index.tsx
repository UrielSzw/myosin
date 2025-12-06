/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the component tree and displays
 * a fallback UI instead of crashing the whole app.
 *
 * Features:
 * - Catches render errors
 * - Logs errors for debugging
 * - Shows user-friendly error screen
 * - Allows retry/recovery
 * - Integrates with logger service
 */

import { logger } from "@/shared/services/logger";
import { Component, ErrorInfo, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// =============================================================================
// TYPES
// =============================================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Custom fallback UI component
   * If not provided, uses default error screen
   */
  fallback?: ReactNode;
  /**
   * Callback when error is caught
   * Use for analytics/error reporting
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /**
   * Callback when user retries
   */
  onRetry?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// =============================================================================
// DEFAULT ERROR SCREEN
// =============================================================================

interface ErrorScreenProps {
  error: Error | null;
  onRetry: () => void;
}

function DefaultErrorScreen({ error, onRetry }: ErrorScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>😵</Text>
        <Text style={styles.title}>¡Ups! Algo salió mal</Text>
        <Text style={styles.subtitle}>
          Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
        </Text>

        {__DEV__ && error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Error (dev only):</Text>
            <Text style={styles.errorMessage}>{error.message}</Text>
          </View>
        )}

        <Pressable style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      </View>
    </View>
  );
}

// =============================================================================
// ERROR BOUNDARY CLASS
// =============================================================================

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when an error is caught
   * This is called during the "render" phase
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log the error
   * This is called during the "commit" phase
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to our logger service
    logger.error("ErrorBoundary caught error", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // Save errorInfo to state for potential display
    this.setState({ errorInfo });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  /**
   * Reset error state to retry rendering
   */
  handleRetry = (): void => {
    logger.info("ErrorBoundary retry triggered");

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    this.props.onRetry?.();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Use default error screen
      return (
        <DefaultErrorScreen
          error={this.state.error}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

// =============================================================================
// FUNCTIONAL WRAPPER (for hooks compatibility)
// =============================================================================

interface WithErrorBoundaryOptions {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * HOC to wrap a component with ErrorBoundary
 *
 * @example
 * const SafeComponent = withErrorBoundary(MyComponent, {
 *   onError: (error) => analytics.trackError(error)
 * });
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
): React.FC<P> {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  const ComponentWithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary fallback={options.fallback} onError={options.onError}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return ComponentWithErrorBoundary;
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    alignItems: "center",
    maxWidth: 320,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#a0a0a0",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  errorBox: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  errorTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ff4444",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  errorMessage: {
    fontSize: 12,
    color: "#ff8888",
    fontFamily: "monospace",
  },
  button: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 160,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0a0a0a",
    textAlign: "center",
  },
});

export default ErrorBoundary;
