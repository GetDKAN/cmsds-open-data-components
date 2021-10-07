/**
 * @jest-environment jsdom
 */

 import React from 'react';
 import { render, screen } from '@testing-library/react';
 import '@testing-library/jest-dom/extend-expect';
 import ResourcePreview from './index';
 
 describe('<ResourcePreview />', () => {
  test('Placeholder', () => {
    expect(true).toBeTruthy();
  });
 });