/**
 * @jest-environment jsdom
 */

 import React from 'react';
 import { render, screen } from '@testing-library/react';
 import '@testing-library/jest-dom/extend-expect';
 import TransformedDate from './index';
 
 describe('<TransformedDate />', () => {
  test('Placeholder', () => {
    expect(true).toBeTruthy();
  });
 });