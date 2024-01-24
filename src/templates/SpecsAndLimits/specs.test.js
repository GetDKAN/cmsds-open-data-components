import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SpecsAndLimits from './index';

describe("<SpecsAndLimits />", () => {
  test('Renders correctly', () => {
    render(<SpecsAndLimits />);

    expect(screen.getByRole('heading', { name: 'Software Specs and Limits' }));
    expect(screen.getAllByRole('row')).toHaveLength(6);
  });
  test('Renders custom rows correctly', () => {
    const documentation = [
      {
        id: 'test',
        application: 'Test Program',
        notes: 'Official size limitations for Test',
        link: 'https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3?redirectSourcePath=%252fen-us%252farticle%252fExcel-specifications-and-limits-ca36e2dc-1f09-4620-b726-67c00b05040f',
        linkText: 'Test Specifications and Limits',
        screenReaderOnlyText:'on Test.com',
      },
    ]
    render(<SpecsAndLimits documentationList={documentation}/>);

    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByText('Test Program')).toBeInTheDocument();
  });
  test('Renders custom content correctly', () => {
    const customContent = (<div>Hello World!</div>);
    render(
      <SpecsAndLimits>
        {customContent}
      </SpecsAndLimits>
    );

    expect(screen.getByText('Hello World!')).toBeInTheDocument();
    expect(screen.queryByText('WinZip')).not.toBeInTheDocument();
  })
})