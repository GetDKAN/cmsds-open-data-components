/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ResourceConditionalField from './index';

describe('<ResourceConditionalField />', () => {
  test('Placeholder', () => {
    expect(true).toBeTruthy();
  });
});
