/**
 * @jest-environment jsdom
 */

 import React from 'react';
 import { render, screen } from '@testing-library/react';
 import '@testing-library/jest-dom/extend-expect';
 import Breadcrumb from './index';
 
 describe('<Breadcrumb />', () => {
  test('Placeholder', () => {
    expect(true).toBeTruthy();
  });
 });