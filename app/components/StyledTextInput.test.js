import React from 'react';
import { render } from '@testing-library/react-native';
import StyledTextInput from './StyledTextInput';

describe('StyledTextInput', () => {
  it('should render without crashing', () => {
    const { root } = render(<StyledTextInput placeholder="Test placeholder" />);
    expect(root).toBeTruthy();
  });

  it('should render with proper structure', () => {
    const { root } = render(<StyledTextInput placeholder="Test placeholder" />);
    expect(root).toBeTruthy();
    expect(root.children[0]).toBeTruthy();
  });

  it('should handle placeholder text', () => {
    const { root } = render(<StyledTextInput placeholder="Enter text here" />);
    expect(root).toBeTruthy();
  });

  it('should handle value prop', () => {
    const { root } = render(<StyledTextInput value="Test value" />);
    expect(root).toBeTruthy();
  });

  it('should handle onChangeText prop', () => {
    const { root } = render(<StyledTextInput onChangeText={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle keyboardType prop', () => {
    const { root } = render(<StyledTextInput keyboardType="numeric" />);
    expect(root).toBeTruthy();
  });

  it('should handle secureTextEntry prop', () => {
    const { root } = render(<StyledTextInput secureTextEntry={true} />);
    expect(root).toBeTruthy();
  });

  it('should handle multiline prop', () => {
    const { root } = render(<StyledTextInput multiline={true} />);
    expect(root).toBeTruthy();
  });

  it('should handle numberOfLines prop', () => {
    const { root } = render(<StyledTextInput numberOfLines={3} />);
    expect(root).toBeTruthy();
  });

  it('should handle editable prop', () => {
    const { root } = render(<StyledTextInput editable={false} />);
    expect(root).toBeTruthy();
  });

  it('should handle autoCapitalize prop', () => {
    const { root } = render(<StyledTextInput autoCapitalize="words" />);
    expect(root).toBeTruthy();
  });

  it('should handle autoCorrect prop', () => {
    const { root } = render(<StyledTextInput autoCorrect={false} />);
    expect(root).toBeTruthy();
  });

  it('should handle returnKeyType prop', () => {
    const { root } = render(<StyledTextInput returnKeyType="done" />);
    expect(root).toBeTruthy();
  });

  it('should handle onSubmitEditing prop', () => {
    const { root } = render(<StyledTextInput onSubmitEditing={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle blurOnSubmit prop', () => {
    const { root } = render(<StyledTextInput blurOnSubmit={true} />);
    expect(root).toBeTruthy();
  });

  it('should handle maxLength prop', () => {
    const { root } = render(<StyledTextInput maxLength={10} />);
    expect(root).toBeTruthy();
  });

  it('should handle placeholderTextColor prop', () => {
    const { root } = render(<StyledTextInput placeholderTextColor="#999" />);
    expect(root).toBeTruthy();
  });

  it('should handle selectionColor prop', () => {
    const { root } = render(<StyledTextInput selectionColor="#007AFF" />);
    expect(root).toBeTruthy();
  });

  it('should handle textAlign prop', () => {
    const { root } = render(<StyledTextInput textAlign="center" />);
    expect(root).toBeTruthy();
  });

  it('should handle textAlignVertical prop', () => {
    const { root } = render(<StyledTextInput textAlignVertical="center" />);
    expect(root).toBeTruthy();
  });
});

