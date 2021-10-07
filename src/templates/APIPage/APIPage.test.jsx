/**
 * @jest-environment jsdom
 */

 import React from 'react';
 import { render, screen } from '@testing-library/react';
 import '@testing-library/jest-dom/extend-expect';
 import APIPage from './index';
 
 describe('<APIPage />', () => {
  test('Placeholder', () => {
    expect(true).toBeTruthy();
  });
 });