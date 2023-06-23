import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DatasetDownloads from './index';

describe('<DatasetDownloads />', () => {
  test('Renders a download URL link and title', () => {
    render(<DatasetDownloads downloadURL="http://dkan.com/download.csv" type="csv" />);
    expect(screen.getByRole('heading', { name: 'Downloads' })).toBeTruthy();
    //expect(screen.getByText('Dataset')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Download this resource (csv)' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Download this resource (csv)' })).toHaveAttribute(
      'href',
      'http://dkan.com/download.csv'
    );
  });
});
