import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatasetSearchFacets from './index';

const testFacets = [
  { type: 'theme', name: 'facet-1', total: '2' },
  { type: 'theme', name: 'facet-2', total: '3' },
];

describe('<DatasetSearchFacets />', () => {
  test('Renders correctly', () => {
    render(<DatasetSearchFacets title="Facets" facets={testFacets} onclickFunction={() => ({})} />);
    expect(screen.getByLabelText('facet-1 (2)')).toBeInTheDocument();
    expect(screen.getByLabelText('facet-2 (3)')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });
  test('Checkbox fires onclickFunction', () => {
    const handleClick = jest.fn();
    render(
      <DatasetSearchFacets title="Facets" facets={testFacets} onClickFunction={handleClick} />
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'facet-1 (2)' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  test('Checkbox is checked if in selectedFacets array', () => {
    const handleClick = jest.fn();
    render(
      <DatasetSearchFacets
        title="Facets"
        facets={testFacets}
        onClickFunction={handleClick}
        selectedFacets={['facet-1']}
      />
    );
    expect(
      screen.getByRole('checkbox', { name: 'facet-1 (2)', checked: true })
    ).toBeInTheDocument();
  });
});
