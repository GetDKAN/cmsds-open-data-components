/**
 * @jest-environment jsdom
 */

 import React from 'react';
 import { render, screen } from '@testing-library/react';
 import '@testing-library/jest-dom/extend-expect';
 import PageNotFound from './index';
 
 describe('<PageNotFound />', () => {
  test('Placeholder', () => {
    expect(true).toBeTruthy();
  });
 });