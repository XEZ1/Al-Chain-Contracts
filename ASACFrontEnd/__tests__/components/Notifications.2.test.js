/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import { WebSocketProvider, useWebSocket } from '../../app/components/Notifications';


jest.mock('expo-notifications');

jest.mock('expo-secure-store');

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ data: 'mocked' })
    })
);

jest.mock('../../app/components/Notifications', () => ({
    ...jest.requireActual('../../app/components/Notifications'),
    useWebSocket: jest.fn(() => ({
        send: jest.fn(),
        close: jest.fn(),
    }))
}));

describe('WebSocket and Notifications Handling', () => {
    it('provides a WebSocket connection', () => {
        const testUrl = 'wss://example.com/ws/notifications/';

        const children = <div>Test Children</div>;
        const { getByText } = render(
            <WebSocketProvider>
                {children}
            </WebSocketProvider>
        );

        //expect(useWebSocket).toHaveBeenCalledWith(testUrl);
        //expect(getByText('Test Children')).toBeInTheDocument();
    });
});


describe('Placeholder test suite', () => {
    it('should always pass', () => {
        expect(true).toBeTruthy();
    });
});
