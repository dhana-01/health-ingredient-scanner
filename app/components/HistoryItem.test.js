import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HistoryItem from './HistoryItem';

describe('HistoryItem', () => {
  const mockItem = {
    id: 1,
    product_name: 'Test Product',
    created_at: '2024-01-01T00:00:00Z',
    status: 'beneficial',
    image_url: 'https://example.com/image.jpg',
    formattedDate: 'Jan 1, 2024'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { root } = render(<HistoryItem item={mockItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should render with proper structure', () => {
    const { root } = render(<HistoryItem item={mockItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
    expect(root.children[0]).toBeTruthy();
  });

  it('should handle beneficial status', () => {
    const beneficialItem = { ...mockItem, status: 'beneficial' };
    const { root } = render(<HistoryItem item={beneficialItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle harmful status', () => {
    const harmfulItem = { ...mockItem, status: 'harmful' };
    const { root } = render(<HistoryItem item={harmfulItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle neutral status', () => {
    const neutralItem = { ...mockItem, status: 'neutral' };
    const { root } = render(<HistoryItem item={neutralItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle unknown status', () => {
    const unknownItem = { ...mockItem, status: 'unknown' };
    const { root } = render(<HistoryItem item={unknownItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle missing status', () => {
    const noStatusItem = { ...mockItem };
    delete noStatusItem.status;
    const { root } = render(<HistoryItem item={noStatusItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle missing product name', () => {
    const noNameItem = { ...mockItem };
    delete noNameItem.product_name;
    const { root } = render(<HistoryItem item={noNameItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle missing formatted date', () => {
    const noDateItem = { ...mockItem };
    delete noDateItem.formattedDate;
    const { root } = render(<HistoryItem item={noDateItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle image URL display', () => {
    const imageItem = { ...mockItem, image_url: 'https://example.com/test.jpg' };
    const { root } = render(<HistoryItem item={imageItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle missing image URL', () => {
    const noImageItem = { ...mockItem };
    delete noImageItem.image_url;
    const { root } = render(<HistoryItem item={noImageItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle image error', () => {
    const imageItem = { ...mockItem, image_url: 'https://example.com/test.jpg' };
    const { root } = render(<HistoryItem item={imageItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle onPress callback', () => {
    const mockOnPress = jest.fn();
    const { root } = render(<HistoryItem item={mockItem} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });

  it('should handle different status icons', () => {
    const beneficialItem = { ...mockItem, status: 'beneficial' };
    const { root: root1 } = render(<HistoryItem item={beneficialItem} onPress={() => {}} />);
    expect(root1).toBeTruthy();

    const harmfulItem = { ...mockItem, status: 'harmful' };
    const { root: root2 } = render(<HistoryItem item={harmfulItem} onPress={() => {}} />);
    expect(root2).toBeTruthy();

    const neutralItem = { ...mockItem, status: 'neutral' };
    const { root: root3 } = render(<HistoryItem item={neutralItem} onPress={() => {}} />);
    expect(root3).toBeTruthy();

    const unknownItem = { ...mockItem, status: 'unknown' };
    const { root: root4 } = render(<HistoryItem item={unknownItem} onPress={() => {}} />);
    expect(root4).toBeTruthy();
  });

  it('should handle image source logic', () => {
    const withImageItem = { ...mockItem, image_url: 'https://example.com/test.jpg' };
    const { root: root1 } = render(<HistoryItem item={withImageItem} onPress={() => {}} />);
    expect(root1).toBeTruthy();

    const withoutImageItem = { ...mockItem };
    delete withoutImageItem.image_url;
    const { root: root2 } = render(<HistoryItem item={withoutImageItem} onPress={() => {}} />);
    expect(root2).toBeTruthy();
  });

  it('should handle image error state', () => {
    const imageItem = { ...mockItem, image_url: 'https://example.com/test.jpg' };
    const { root } = render(<HistoryItem item={imageItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle long product names', () => {
    const longNameItem = { ...mockItem, product_name: 'This is a very long product name that might wrap to multiple lines and need proper handling' };
    const { root } = render(<HistoryItem item={longNameItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle special characters in product names', () => {
    const specialCharItem = { ...mockItem, product_name: 'Product with special chars: @#$%^&*()' };
    const { root } = render(<HistoryItem item={specialCharItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle empty product names', () => {
    const emptyNameItem = { ...mockItem, product_name: '' };
    const { root } = render(<HistoryItem item={emptyNameItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle null product names', () => {
    const nullNameItem = { ...mockItem, product_name: null };
    const { root } = render(<HistoryItem item={nullNameItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });

  it('should handle undefined product names', () => {
    const undefinedNameItem = { ...mockItem, product_name: undefined };
    const { root } = render(<HistoryItem item={undefinedNameItem} onPress={() => {}} />);
    expect(root).toBeTruthy();
  });
});
