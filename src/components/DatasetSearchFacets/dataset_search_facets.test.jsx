import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DatasetSearchFacets from './index';
import { isSelected } from './index';

const testFacets = [
  { type: 'theme', name: 'facet-1', total: '2' },
  { type: 'theme', name: 'facet-2', total: '3' },
];

describe('isSelected Function', () => {
  test('returns -1 if not selected', () => {
    expect(isSelected('dkan', [''])).toEqual(-1);
  });
  test('returns correct index if item in array', () => {
    expect(isSelected('dkan', ['dkan'])).toEqual(0);
    expect(isSelected('react', ['dkan', 'react'])).toEqual(1);
  });
});

describe('<DatasetSearchFacets />', () => {
  test('Renders correctly', () => {
    render(<DatasetSearchFacets title="Facets" facets={testFacets} onclickFunction={() => ({})} />);
    expect(screen.getByRole('button', { name: 'Facets (2) Close' })).toBeInTheDocument();
    expect(screen.getByLabelText('facet-1 (2)')).toBeInTheDocument();
    expect(screen.getByLabelText('facet-2 (3)')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });
  /*
  test('Opens and closes, hiding facets', () => {
    render(<DatasetSearchFacets title="Facets" facets={testFacets} onclickFunction={() => ({})} />);
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Facets (2) Close' }));
    // expect(screen.queryByLabelText('facet-1 (2)')).toBeNull();
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Facets' }));
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });
  */
  test('Checkbox fires onclickFunction', () => {
    const handleClick = jest.fn();
    render(
      <DatasetSearchFacets title="Facets" facets={testFacets} onclickFunction={handleClick} />
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
        onclickFunction={handleClick}
        selectedFacets={['facet-1']}
      />
    );
    expect(
      screen.getByRole('checkbox', { name: 'facet-1 (2)', checked: true })
    ).toBeInTheDocument();
  });
});
