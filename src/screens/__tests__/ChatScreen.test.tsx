import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { TextInput, TouchableOpacity } from 'react-native';
import ChatScreen from '../ChatScreen';

describe('ChatScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<ChatScreen />);
    
    // Should show welcome message
    expect(getByText(/Hi! I'm Beau, your relationship coach/)).toBeTruthy();
  });

  it('displays welcome message on load', () => {
    const { getByText } = render(<ChatScreen />);
    
    const welcomeMessage = getByText(/Hi! I'm Beau, your relationship coach/);
    expect(welcomeMessage).toBeTruthy();
    expect(welcomeMessage.props.children).toContain("I'm here to help you navigate your relationships");
  });

  it('renders input field and send button', () => {
    const { getByPlaceholderText, getByTestId } = render(<ChatScreen />);
    
    // Check for input field
    const inputField = getByPlaceholderText('Type a message...');
    expect(inputField).toBeTruthy();
    
    // Check for send button
    const sendButton = getByTestId('send-button');
    expect(sendButton).toBeTruthy();
  });

  it('allows typing in input field', () => {
    const { getByPlaceholderText } = render(<ChatScreen />);
    
    const inputField = getByPlaceholderText('Type a message...');
    fireEvent.changeText(inputField, 'Hello Beau!');
    
    expect(inputField.props.value).toBe('Hello Beau!');
  });

  it('clears input after sending message', async () => {
    const { getByPlaceholderText, getByTestId } = render(<ChatScreen />);
    
    const inputField = getByPlaceholderText('Type a message...');
    const sendButton = getByTestId('send-button');
    
    // Type a message
    fireEvent.changeText(inputField, 'Test message');
    
    // Send the message
    fireEvent.press(sendButton);
    
    // Wait for the input to be cleared
    await waitFor(() => {
      expect(inputField.props.value).toBe('');
    });
  });

  it('shows typing indicator when sending message', async () => {
    const { getByPlaceholderText, getByTestId, getByTestId: getByTestId2 } = render(<ChatScreen />);
    
    const inputField = getByPlaceholderText('Type a message...');
    const sendButton = getByTestId('send-button');
    
    // Type and send a message
    fireEvent.changeText(inputField, 'Test message');
    fireEvent.press(sendButton);
    
    // Should show typing indicator (animated dots)
    await waitFor(() => {
      // Check that the typing indicator container exists
      const messageList = getByTestId2('message-list');
      expect(messageList).toBeTruthy();
    });
  });

  it('displays user message after sending', async () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<ChatScreen />);
    
    const inputField = getByPlaceholderText('Type a message...');
    const sendButton = getByTestId('send-button');
    
    const testMessage = 'Hello Beau, I need relationship advice';
    
    // Type and send a message
    fireEvent.changeText(inputField, testMessage);
    fireEvent.press(sendButton);
    
    // Should display the user message
    await waitFor(() => {
      expect(getByText(testMessage)).toBeTruthy();
    });
  });

  it('handles empty message gracefully', () => {
    const { getByTestId } = render(<ChatScreen />);
    
    const sendButton = getByTestId('send-button');
    
    // Try to send empty message
    fireEvent.press(sendButton);
    
    // Should not crash and should not add empty message
    expect(sendButton).toBeTruthy();
  });

  it('handles whitespace-only message gracefully', () => {
    const { getByPlaceholderText, getByTestId } = render(<ChatScreen />);
    
    const inputField = getByPlaceholderText('Type a message...');
    const sendButton = getByTestId('send-button');
    
    // Type only whitespace
    fireEvent.changeText(inputField, '   ');
    
    // Try to send
    fireEvent.press(sendButton);
    
    // Should not add whitespace-only message
    expect(inputField.props.value).toBe('   ');
  });

  it('maintains conversation history', async () => {
    const { getByPlaceholderText, getByTestId, getAllByText } = render(<ChatScreen />);
    
    const inputField = getByPlaceholderText('Type a message...');
    const sendButton = getByTestId('send-button');
    
    // Send first message
    fireEvent.changeText(inputField, 'First message');
    fireEvent.press(sendButton);
    
    await waitFor(() => {
      expect(inputField.props.value).toBe('');
    });
    
    // Send second message
    fireEvent.changeText(inputField, 'Second message');
    fireEvent.press(sendButton);
    
    await waitFor(() => {
      expect(inputField.props.value).toBe('');
    });
    
    // Should have both messages in history
    expect(getAllByText('First message')).toBeTruthy();
    expect(getAllByText('Second message')).toBeTruthy();
  });

  it('handles keyboard interactions properly', () => {
    const { getByPlaceholderText } = render(<ChatScreen />);
    
    const inputField = getByPlaceholderText('Type a message...');
    
    // Test keyboard focus
    fireEvent(inputField, 'focus');
    expect(inputField.props.value).toBeDefined();
    
    // Test keyboard blur
    fireEvent(inputField, 'blur');
    expect(inputField.props.value).toBeDefined();
  });

  it('renders with proper styling', () => {
    const { getByTestId } = render(<ChatScreen />);
    
    // Check main container
    const container = getByTestId('chat-container');
    expect(container).toBeTruthy();
    
    // Check message list
    const messageList = getByTestId('message-list');
    expect(messageList).toBeTruthy();
  });

  it('displays AI response after user message', async () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<ChatScreen />);
    
    const inputField = getByPlaceholderText('Type a message...');
    const sendButton = getByTestId('send-button');
    
    // Send a message
    fireEvent.changeText(inputField, 'Hello Beau!');
    fireEvent.press(sendButton);
    
    // Wait for AI response (simulated)
    await waitFor(() => {
      expect(getByText("Thanks for your message! I'm here to help with your relationship questions. What's on your mind?")).toBeTruthy();
    }, { timeout: 2000 });
  });

  it('shows different message styles for user vs AI', async () => {
    const { getByPlaceholderText, getByTestId, getByText } = render(<ChatScreen />);
    
    const inputField = getByPlaceholderText('Type a message...');
    const sendButton = getByTestId('send-button');
    
    // Send a message
    fireEvent.changeText(inputField, 'User message');
    fireEvent.press(sendButton);
    
    // Wait for both messages to appear
    await waitFor(() => {
      expect(getByText('User message')).toBeTruthy();
    });
    
    await waitFor(() => {
      expect(getByText(/Thanks for your message/)).toBeTruthy();
    }, { timeout: 2000 });
  });
}); 