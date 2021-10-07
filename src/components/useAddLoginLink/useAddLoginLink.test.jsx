/**
 * @jest-environment jsdom
 */

 import React from 'react';
 import { render, screen } from '@testing-library/react';
 import '@testing-library/jest-dom/extend-expect';
 import useAddLoginLink from './index';
 
 describe('useAddLoginLink', () => {
  test('Placeholder', () => {
    expect(true).toBeTruthy();
  });
 });