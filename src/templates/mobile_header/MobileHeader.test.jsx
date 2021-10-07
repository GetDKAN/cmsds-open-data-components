/**
 * @jest-environment jsdom
 */

 import React from 'react';
 import { render, screen } from '@testing-library/react';
 import '@testing-library/jest-dom/extend-expect';
 import MobileHeader from './';

 describe('<MobileHeader />', () => {
  test('Placeholder', () => {
    expect(true).toBeTruthy();
  });
 });