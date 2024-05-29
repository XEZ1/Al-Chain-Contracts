import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ContractItem } from '../../../../app/screens/PostLoginScreens/Home/ContractItem';
import { Animated, Alert } from 'react-native';
import { act } from '@testing-library/react-hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getByTestId } from '@testing-library/react';

jest.spyOn(Animated, 'timing').mockImplementation((value, config) => ({
    start: jest.fn((callback) => {
        callback && callback();
    }),
    stopAnimation: jest.fn()
}));

jest.spyOn(Animated, 'parallel').mockImplementation((animations) => ({
    start: jest.fn((callback) => {
        callback && callback();
    })
}));

jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
    global.alertButtons = buttons;
});

jest.mock('@expo/vector-icons', () => {
    const { Text } = require('react-native');
    return {
        MaterialCommunityIcons: ({ name, size, color, testID }) => (
            <Text style={{ color }} testID={testID}>{`${name}`}</Text>
        ),
    };
});

describe('ContractItem', () => {
    const openContract = jest.fn();
    const openShareContract = jest.fn();
    const deleteContract = jest.fn();

    const renderContractItem = (theme = 'light', contractName = 'TestContract',) => {
        return render(
            <ContractItem
                contract={{ contract_name: contractName }}
                openContract={openContract}
                openShareContract={openShareContract}
                deleteContract={deleteContract}
                theme={theme}
            />
        );
    };

    it('renders correctly', () => {
        const { getByText } = renderContractItem();
        expect(getByText('TestContract.sol')).toBeTruthy();
        expect(getByText('chevron-down')).toBeTruthy();
        expect(getByText('file-document-outline')).toBeTruthy();
        expect(getByText('Access Contract')).toBeTruthy();
        expect(getByText('share-outline')).toBeTruthy();
        expect(getByText('delete-outline')).toBeTruthy();
        expect(getByText('Delete Contract')).toBeTruthy();
    });

    it('renders correctly with light theme', () => {
        const { getByText, getByTestId } = renderContractItem('light');

        const chevronDown = getByText('chevron-down');
        const chevronDownColour = chevronDown.props.style.color;
        expect(chevronDownColour).toEqual('black');

        fireEvent.press(getByTestId('chevronTestID'));

        const fileDocumentOutline = getByText('file-document-outline');
        const fileDocumentOutlineColour = fileDocumentOutline.props.style.color;
        expect(fileDocumentOutlineColour).toEqual('black');
    });

    it('renders correctly with dark theme', () => {
        const { getByText, getByTestId } = renderContractItem('dark');

        const chevronDown = getByText('chevron-down');
        const chevronDownColour = chevronDown.props.style.color;
        expect(chevronDownColour).toEqual('white');

        fireEvent.press(getByTestId('chevronTestID'));

        const fileDocumentOutline = getByText('file-document-outline');
        const fileDocumentOutlineColour = fileDocumentOutline.props.style.color;
        expect(fileDocumentOutlineColour).toEqual('white');
    });

    it('toggles expand on press (expand & close)', async () => {
        const { getByText, getByTestId } = renderContractItem();

        expect(getByText('chevron-down')).toBeTruthy();

        fireEvent.press(getByTestId('chevronTestID'));

        expect(getByText('chevron-up')).toBeTruthy();

        fireEvent.press(getByTestId('chevronTestID'));

        expect(getByText('chevron-down')).toBeTruthy();
    });

    it('handles contract opening', async () => {
        const { getByText } = renderContractItem();

        fireEvent.press(getByText('Access Contract'));

        expect(openContract).toHaveBeenCalled();
    });

    it('handles contract sharing', () => {
        const { getByText } = renderContractItem();

        fireEvent.press(getByText('Share Contract'));

        expect(openShareContract).toHaveBeenCalled();
    });

    it('initiates and handles deletion', () => {
        const { getByText } = renderContractItem();

        fireEvent.press(getByText('Delete Contract'));

        expect(Alert.alert).toHaveBeenCalled();

        const deleteButton = global.alertButtons.find(button => button.text === 'Delete');
        deleteButton.onPress();

        expect(deleteContract).toHaveBeenCalled();
    });

    it('cleans up on unmount during handleDeletionAnimation', () => {
        const { getByText, unmount } = renderContractItem();

        fireEvent.press(getByText('Delete Contract'));

        unmount();
        const deleteButton = global.alertButtons.find(button => button.text === 'Delete');
        deleteButton.onPress();

        expect(deleteContract).toHaveBeenCalled();
    });

    it('cleans up on unmount during toggleExpand', async () => {
        const { getByTestId, unmount } = renderContractItem();

        fireEvent.press(getByTestId('chevronTestID'));

        unmount();
    });

    it('stops animation on unmount during toggleExpand', async () => {
        let animationEndCallback;
        jest.spyOn(Animated, 'timing').mockImplementation((value, config) => ({
            start: jest.fn((callback) => {
                animationEndCallback = callback;
            }),
            stopAnimation: jest.fn()
        }));

        const { getByTestId, unmount } = renderContractItem();

        fireEvent.press(getByTestId('chevronTestID'));

        unmount();

        if (animationEndCallback) {
            animationEndCallback();
        }
    });    
});
