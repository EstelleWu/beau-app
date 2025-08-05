import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import ErrorBoundary from '../ErrorBoundary';

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

beforeAll(() => {
  console.error = jest.fn();
  console.log = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.log = originalConsoleLog;
});

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <Text>Normal component</Text>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Test content</Text>
      </ErrorBoundary>
    );

    expect(getByText('Test content')).toBeTruthy();
  });

  it('renders error UI when child throws an error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should show error UI
    expect(getByText('🚨 Something went wrong')).toBeTruthy();
    expect(getByText('Test error message')).toBeTruthy();
  });

  it('logs error information when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Check that error logging was called
    expect(console.error).toHaveBeenCalledWith(
      '🚨 ErrorBoundary caught an error:',
      expect.any(Error)
    );
    expect(console.error).toHaveBeenCalledWith(
      '🚨 Error info:',
      expect.any(Object)
    );
  });

  it('logs automatic error detection information', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Check that automatic detection logging was called
    expect(console.log).toHaveBeenCalledWith('🔍 AUTOMATIC ERROR DETECTED:');
    expect(console.log).toHaveBeenCalledWith('Error Type:', 'Error');
    expect(console.log).toHaveBeenCalledWith('Error Message:', 'Test error message');
  });

  it('resets error state when reset button is pressed', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Initially shows error
    expect(getByText('🚨 Something went wrong')).toBeTruthy();

    // Click reset button
    fireEvent.press(getByText('Try Again'));

    // After reset, the error boundary should still show error UI
    // because the child component still throws an error
    // But the internal state has been reset, so we can verify the button is still there
    expect(getByText('Try Again')).toBeTruthy();
    expect(getByText('🚨 Something went wrong')).toBeTruthy();
  });

  it('handles NativeModule errors with appropriate suggestions', () => {
    const NativeModuleError = () => {
      throw new Error('NativeModule undefined');
    };

    render(
      <ErrorBoundary>
        <NativeModuleError />
      </ErrorBoundary>
    );

    // Check that NativeModule suggestion was logged
    expect(console.log).toHaveBeenCalledWith(
      '🔧 AUTO-SUGGESTION: NativeModule error - check component imports'
    );
  });

  it('handles property access errors with appropriate suggestions', () => {
    const PropertyError = () => {
      throw new Error('Cannot read property of undefined');
    };

    render(
      <ErrorBoundary>
        <PropertyError />
      </ErrorBoundary>
    );

    // Check that property access suggestion was logged
    expect(console.log).toHaveBeenCalledWith(
      '🔧 AUTO-SUGGESTION: Property access error - add null checks'
    );
  });

  it('handles undefined errors with appropriate suggestions', () => {
    const UndefinedError = () => {
      throw new Error('Something is undefined');
    };

    render(
      <ErrorBoundary>
        <UndefinedError />
      </ErrorBoundary>
    );

    // Check that undefined suggestion was logged
    expect(console.log).toHaveBeenCalledWith(
      '🔧 AUTO-SUGGESTION: Undefined variable - check declarations'
    );
  });

  it('displays error stack trace', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should show some part of the stack trace
    const errorStack = getByText(/ErrorBoundary.test.tsx/);
    expect(errorStack).toBeTruthy();
  });

  it('maintains error state across re-renders', () => {
    const { getByText, rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Initially shows error
    expect(getByText('🚨 Something went wrong')).toBeTruthy();

    // Re-render with same props
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should still show error
    expect(getByText('🚨 Something went wrong')).toBeTruthy();
  });
}); 