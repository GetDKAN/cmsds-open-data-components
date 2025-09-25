import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Resource from './index';
import * as resource from '../../tests/fixtures/resource.json';
import * as distribution from '../../tests/fixtures/distribution.json';
import * as distributionWithCustomTitle from '../../tests/fixtures/distributionWithTitle.json';
import withQueryProvider from '../../utilities/QueryProvider/QueryProvider';

describe('<Resource />', () => {
  test('Renders correctly', () => {
    resource.setResource = jest.fn();

    const distributions = JSON.parse(JSON.stringify(distribution.distribution));
    distributions[0].data.title = undefined;

    const Wrapped = withQueryProvider(() => (
      <Resource
        resource={resource}
        distributions={distributions}
        title={'Test title'}
        fileFormat={'csv'}
        rootUrl="/"
      />
    ));
    render(<Wrapped />);
    expect(screen.getByText('Test title (CSV)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Download Test title csv' })).toBeInTheDocument();
  });
  test('Renders custom title and description if they exist', () => {
    resource.setResource = jest.fn();
    const Wrapped = withQueryProvider(() => (
      <Resource
        resource={resource}
        distributions={distributionWithCustomTitle.distribution}
        title={'Test title'}
        fileFormat={'csv'}
        rootUrl="/"
      />
    ));
    render(<Wrapped />);
    expect(screen.getByText('Test Custom Title (CSV)')).toBeInTheDocument();
    expect(screen.getByText('Test Custom Description')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Download Test Custom Title csv' })
    ).toBeInTheDocument();
  });
});
