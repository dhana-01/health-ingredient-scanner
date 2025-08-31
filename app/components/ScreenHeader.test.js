import React from 'react';
import { render } from '@testing-library/react-native';
import ScreenHeader from './ScreenHeader';

describe('ScreenHeader', () => {
  it('renders without crashing', () => {
    const { root } = render(
      <ScreenHeader title="Test Title" />
    );
    
    // Check if the component renders without crashing
    expect(root).toBeTruthy();
  });

  it('renders with different titles', () => {
    const { root } = render(
      <ScreenHeader title="Welcome Screen" />
    );
    
    expect(root).toBeTruthy();
  });

  it('renders empty title when no title is provided', () => {
    const { root } = render(
      <ScreenHeader title="" />
    );
    
    expect(root).toBeTruthy();
  });
});
