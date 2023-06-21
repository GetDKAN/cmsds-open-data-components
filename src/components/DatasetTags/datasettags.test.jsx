import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DatasetTags from './index';
import { MemoryRouter } from 'react-router-dom';

describe('<DatasetTags />', () => {
  test('Renders a download URL link and title', () => {
    const tagList = [
      { data: 'Tag 1', identifier: '1' },
      { data: 'Tag 2', identifier: '2' },
      { data: 'Tag 3', identifier: '3' },
    ];
    render(<MemoryRouter><DatasetTags keywords={tagList} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Tags' })).toBeTruthy();
    tagList.forEach((tag) => {
      expect(screen.getByRole('link', { name: tag.data })).toBeTruthy();
      expect(screen.getByRole('link', { name: tag.data })).toHaveAttribute(
        'href',
        `/datasets?keyword[]=${tag.data}`
      );
    });
  });
});
