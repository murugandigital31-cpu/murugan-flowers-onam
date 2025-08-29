import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DesignerPage from '../pages/DesignerPage';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

describe('DesignerPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders design method options', () => {
    render(<DesignerPage setDesignResult={jest.fn()} />);
    
    expect(screen.getByText('Design Your Pookkolam')).toBeInTheDocument();
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
    expect(screen.getByText('Guided Builder')).toBeInTheDocument();
  });

  test('allows color selection in guided builder', () => {
    render(<DesignerPage setDesignResult={jest.fn()} />);
    
    // Select guided builder
    const guidedBuilderOption = screen.getByText('Guided Builder');
    fireEvent.click(guidedBuilderOption);
    
    // Check if color selector is visible
    expect(screen.getByText('Select Colors:')).toBeInTheDocument();
    
    // Select a color
    const yellowColorOption = screen.getByTitle('Yellow');
    fireEvent.click(yellowColorOption);
    
    // Verify color is selected
    expect(screen.getByText('Selected: Yellow')).toBeInTheDocument();
  });

  test('shows flower images for selected colors', () => {
    render(<DesignerPage setDesignResult={jest.fn()} />);
    
    // Select guided builder
    const guidedBuilderOption = screen.getByText('Guided Builder');
    fireEvent.click(guidedBuilderOption);
    
    // Select a color
    const yellowColorOption = screen.getByTitle('Yellow');
    fireEvent.click(yellowColorOption);
    
    // Check if flower images are displayed
    expect(screen.getByText('Selected Flower Types:')).toBeInTheDocument();
    expect(screen.getByText('Yellow')).toBeInTheDocument();
    
    // Check if flower images are present
    const flowerImages = screen.getAllByAltText('Yellow flower example');
    expect(flowerImages.length).toBeGreaterThan(0);
  });

  test('allows flower selection', () => {
    render(<DesignerPage setDesignResult={jest.fn()} />);
    
    // Select guided builder
    const guidedBuilderOption = screen.getByText('Guided Builder');
    fireEvent.click(guidedBuilderOption);
    
    // Select a color
    const yellowColorOption = screen.getByTitle('Yellow');
    fireEvent.click(yellowColorOption);
    
    // Select a flower
    const flowerImage = screen.getAllByAltText('Yellow flower example')[0];
    fireEvent.click(flowerImage);
    
    // Verify selection indicator is present
    const selectionIndicator = screen.getByText('✓');
    expect(selectionIndicator).toBeInTheDocument();
  });
});