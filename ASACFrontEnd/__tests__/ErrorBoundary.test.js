import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import ErrorBoundary from '../ErrorBoundary';


describe('ErrorBoundary', () => {
    const ProblemChild = () => {
        const { Text } = require('react-native');
        throw new Error('Error thrown from problem child');
        return <Text>This should not render</Text>;
    };

    it('should catch errors with componentDidCatch', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        render(
            <ErrorBoundary>
                <ProblemChild />
            </ErrorBoundary>
        );

        expect(consoleLogSpy).toHaveBeenCalled();

        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    it('should update state upon an error and display fallback UI', () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const { getByText } = render(
            <ErrorBoundary>
                <ProblemChild />
            </ErrorBoundary>
        );

        expect(getByText('Something went wrong.')).toBeTruthy();

        consoleLogSpy.mockRestore();
        consoleErrorSpy.mockRestore();
    });

    it('should render the child component when there are no errors', () => {
        const childText = 'No problems here';
        const { getByText } = render(
            <ErrorBoundary>
                <Text>{childText}</Text>
            </ErrorBoundary>
        );

        expect(getByText(childText)).toBeTruthy();
    });
});
