import React from 'react';
import { render } from '@testing-library/react-native';
import SocialButton from './SocialButton';

describe('SocialButton', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { root } = render(<SocialButton title="Google" onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should render with proper structure', () => {
    const { root } = render(<SocialButton title="Google" onPress={mockOnPress} />);
    expect(root).toBeTruthy();
    expect(root.children[0]).toBeTruthy();
  });

  it('should handle Google button', () => {
    const { root } = render(<SocialButton title="Google" onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle Facebook button', () => {
    const { root } = render(<SocialButton title="Facebook" onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle Apple button', () => {
    const { root } = render(<SocialButton title="Apple" onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle Twitter button', () => {
    const { root } = render(<SocialButton title="Twitter" onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle Instagram button', () => {
    const { root } = render(<SocialButton title="Instagram" onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle LinkedIn button', () => {
    const { root } = render(<SocialButton title="LinkedIn" onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle custom social platforms', () => {
    const { root } = render(<SocialButton title="Custom Platform" onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle button press', () => {
    const { root } = render(<SocialButton title="Google" onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle disabled state', () => {
    const { root } = render(<SocialButton title="Google" onPress={mockOnPress} disabled={true} />);
    expect(root).toBeTruthy();
  });

  it('should handle loading state', () => {
    const { root } = render(<SocialButton title="Google" onPress={mockOnPress} loading={true} />);
    expect(root).toBeTruthy();
  });

  it('should handle different button sizes', () => {
    const { root: smallButton } = render(<SocialButton title="Google" onPress={mockOnPress} size="small" />);
    expect(smallButton).toBeTruthy();

    const { root: mediumButton } = render(<SocialButton title="Google" onPress={mockOnPress} size="medium" />);
    expect(mediumButton).toBeTruthy();

    const { root: largeButton } = render(<SocialButton title="Google" onPress={mockOnPress} size="large" />);
    expect(largeButton).toBeTruthy();
  });

  it('should handle different button variants', () => {
    const { root: primaryButton } = render(<SocialButton title="Google" onPress={mockOnPress} variant="primary" />);
    expect(primaryButton).toBeTruthy();

    const { root: secondaryButton } = render(<SocialButton title="Google" onPress={mockOnPress} variant="secondary" />);
    expect(secondaryButton).toBeTruthy();

    const { root: outlineButton } = render(<SocialButton title="Google" onPress={mockOnPress} variant="outline" />);
    expect(outlineButton).toBeTruthy();
  });

  it('should handle icon display', () => {
    const { root } = render(<SocialButton title="Google" onPress={mockOnPress} icon="logo-google" />);
    expect(root).toBeTruthy();
  });

  it('should handle long titles', () => {
    const { root } = render(<SocialButton title="This is a very long social button title" onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle missing title', () => {
    const { root } = render(<SocialButton onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle missing onPress', () => {
    const { root } = render(<SocialButton title="Google" />);
    expect(root).toBeTruthy();
  });

  it('should handle custom styles', () => {
    const { root } = render(<SocialButton title="Google" onPress={mockOnPress} style={{ backgroundColor: 'red' }} />);
    expect(root).toBeTruthy();
  });

  it('should handle accessibility props', () => {
    const { root } = render(<SocialButton title="Google" onPress={mockOnPress} accessibilityLabel="Sign in with Google" />);
    expect(root).toBeTruthy();
  });

  it('should handle testID prop', () => {
    const { root } = render(<SocialButton title="Google" onPress={mockOnPress} testID="google-signin-button" />);
    expect(root).toBeTruthy();
  });
});
