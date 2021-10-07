/**
 * @jest-environment jsdom
 */

 import React from 'react';
 import { render, screen } from '@testing-library/react';
 import '@testing-library/jest-dom/extend-expect';
 import SearchModal from './index';
 
 describe('<SearchModal />', () => {
  test('Placeholder', () => {
    expect(true).toBeTruthy();
  });
 });