import React from 'react';
import { render } from '@testing-library/react';
import PlaneShaderforIKEA from './Plane';
import { useFrame } from '@react-three/fiber';

jest.mock('@react-three/fiber', () => ({
  ...jest.requireActual('@react-three/fiber'),
  useFrame: jest.fn(),
}));

describe('PlaneShaderforIKEA', () => {
  it('renders without crashing', () => {
    render(<PlaneShaderforIKEA />);
  });

  it('does not call useFrame', () => {
    render(<PlaneShaderforIKEA />);
    expect(useFrame).toHaveBeenCalledTimes(2);
  });
});