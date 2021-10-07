/**
 * @jest-environment jsdom
 */

 import React from 'react';
 import { render, screen } from '@testing-library/react';
 import '@testing-library/jest-dom/extend-expect';
 import Hero from './index';
 
 describe('<Hero />', () => {
  test('Placeholder', () => {
    expect(true).toBeTruthy();
  });
 });