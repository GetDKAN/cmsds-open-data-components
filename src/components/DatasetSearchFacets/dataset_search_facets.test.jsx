import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DatasetSearchFacets from './index';

const testFacets = [{type: 'theme', name: 'facet-1', total: '2'}]

describe('<DatasetSearchFacets />', () => {
  test('Renders correctly', () => {
    render(
      <DatasetSearchFacets title="Facets" facets={testFacets} onclickFunction={() => ({})} />,
    );
    expect(screen.getByRole('heading', { name: "Facets" })).toBeTruthy();
    expect(screen.getByText('facet-1 (2)')).toBeTruthy();
  });
});
