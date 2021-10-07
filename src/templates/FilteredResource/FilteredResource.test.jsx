/**
 * @jest-environment jsdom
 */

 import React from 'react';
 import { render, screen } from '@testing-library/react';
 import '@testing-library/jest-dom/extend-expect';
 import FilteredResource from './index';
 
 describe('<FilteredResource />', () => {
  test('Placeholder', () => {
    expect(true).toBeTruthy();
  });
 });