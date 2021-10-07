/**
 * @jest-environment jsdom
 */

 import React from 'react';
 import { render, screen } from '@testing-library/react';
 import '@testing-library/jest-dom/extend-expect';
 import SubMenu from './index';
 
 describe('<SubMenu />', () => {
  test('Placeholder', () => {
    expect(true).toBeTruthy();
  });
 });