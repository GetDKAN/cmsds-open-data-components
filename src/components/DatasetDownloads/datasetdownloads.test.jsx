import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatasetDownloads from './index';

const dataDictionaryURLFixture = "https://test.com/file.pdf";
const dataDictionaryTypeFixture = "application/pdf";
const distributionsFixture = [
  {identifier: "1", data: {downloadURL: "https://test.com/file.csv", format: "csv"}},
  {identifier: "2", data: {downloadURL: "https://test.com/file.xlsx", format: "xlsx"}},
];


describe('<DatasetDownloads />', () => {
  test('Renders a download URL link and title', () => {
    render(
      <DatasetDownloads
        dataDictionaryURL={dataDictionaryURLFixture}
        dataDictionaryType={dataDictionaryTypeFixture}
        distributions={distributionsFixture}
      />
    );
    expect(screen.getByRole('heading', { name: 'Downloads' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'CSV Resource File' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'CSV Resource File' })).toHaveAttribute(
      'href',
      'https://test.com/file.csv'
    );
    expect(screen.getByRole('link', { name: 'XLSX Resource File' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'XLSX Resource File' })).toHaveAttribute(
      'href',
      'https://test.com/file.xlsx'
    );
  });
  test('Renders a data dictionary link', () => {
    render(
      <DatasetDownloads
        dataDictionaryURL={dataDictionaryURLFixture}
        dataDictionaryType={dataDictionaryTypeFixture}
        distributions={distributionsFixture}
      />
    );
    expect(screen.getByRole('heading', { name: 'Downloads' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Data Dictionary (PDF)' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Data Dictionary (PDF)' })).toHaveAttribute(
      'href',
      'https://test.com/file.pdf'
    );
  });
});
