/**
 * @jest-environment jsdom
 */

 import React from 'react';
 import { render, screen } from '@testing-library/react';
 import '@testing-library/jest-dom/extend-expect';
 import NavBar from './index';
 
 describe('<NavBar />', () => {
  test('Placeholder', () => {
    expect(true).toBeTruthy();
  });
 });