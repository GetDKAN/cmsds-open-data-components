import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import DatasetAdditionalInformation from './index';
import { defaultMetadataMapping } from '../../assets/metadataMapping';
import * as dataset from "../../tests/fixtures/dataset.json";
import { MemoryRouter } from 'react-router-dom';

describe('<DatasetAdditionalInformation />', () => {
  test("Renders correctly", () => {
    const metadataMapping = {
      ...defaultMetadataMapping,
    }
    render(
      <MemoryRouter>
        <DatasetAdditionalInformation
          metadata={dataset}
          metadataMapping={metadataMapping}
        />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 2 , name: 'Additional Information'})).toBeInTheDocument();
    const infoTable = screen.getByRole('table');
    const basicTableRows = [
      ['Modified', 'January 16, 2024'],
      ['Issued', 'August 19, 2015'],
      ['Frequency', 'Decennial'],
      ['Publisher', 'data.medicaid.gov'],
      ['Identifier', '4eaa5ebe-62f7-402e-a407-963cd380688b'],
      ['Contact', 'Medicaid.gov'],
      ['Contact Email', 'mailto:Medicaid.gov@cms.hhs.gov'],
      ['Bureau Code', '009:00'],
      ['Program Code', '009:000'],
      ['Tags', 'keyword1 , tag2'],
      ['Category', 'theme1 , theme 2'],
      ['License', 'http://www.usa.gov/publicdomain/label/1.0/'],
      ['Public Access Level', 'public'],
      ['Temporal Coverage', '2022-01-01/2022-12-31'],
      ['Spacial/Geographical Coverage', 'Florida'],
      ['Related Documents', 'https://test.com https://test-2.com']
    ];
    
    basicTableRows.forEach((rowData) => {
      expect(screen.getByRole('row', { name: rowData[0] + ' ' + rowData[1]}));
      expect(screen.getByRole('rowheader', { name: rowData[0]}));
      expect(screen.getByRole('cell', { name: rowData[1]}));
    })
    
    expect(within(infoTable).getAllByRole('listitem').length).toBe(2);
    
    const tableLinks = [
      ['theme1', '/datasets?theme[]=theme1'],
      ['theme 2', '/datasets?theme[]=theme 2'],
      ['keyword1', '/datasets?keyword[]=keyword1'],
      ['tag2', '/datasets?keyword[]=tag2'],
      ['http://www.usa.gov/publicdomain/label/1.0/', 'http://www.usa.gov/publicdomain/label/1.0/'],
      ['https://test.com', 'https://test.com'],
      ['https://test-2.com', 'https://test-2.com']
    ];
    
    tableLinks.forEach((tLink) => {
      expect(within(infoTable).getByRole('link', { name: tLink[0]})).toHaveAttribute('href', tLink[1]);
    });
  });
  test("Doesn't render missing keys", () => {
    const metadataMapping = {
      ...defaultMetadataMapping,
    }
    render(
      <MemoryRouter>
        <DatasetAdditionalInformation
          metadata={{"identifier": "4eaa5ebe-62f7-402e-a407-963cd380688b",}}
          metadataMapping={metadataMapping}
        />
      </MemoryRouter>
    )
    const infoTable = screen.getByRole('table');
    expect(within(infoTable).getAllByRole('row').length).toBe(1);
  });

  test("Doesn't render publisher if data is missing", () => {
    const metadataMapping = {
      ...defaultMetadataMapping,
    }
    
    render(
      <MemoryRouter>
        <DatasetAdditionalInformation
          metadata={{identifier: "4eaa5ebe-62f7-402e-a407-963cd380688b", publisher: { identifier: 1234}}}
          metadataMapping={metadataMapping}
        />
      </MemoryRouter>
    )
    const infoTable = screen.getByRole('table');
    expect(within(infoTable).getAllByRole('row').length).toBe(1);
  });
  test("Doesn't render publisher if data and data.name is missing", () => {
    const metadataMapping = {
      ...defaultMetadataMapping,
    }
    render(
      <MemoryRouter>
        <DatasetAdditionalInformation
          metadata={{identifier: 1234, publisher: { identifier: 1234, data: { id: "Not name key"}}}}
          metadataMapping={metadataMapping}
        />
      </MemoryRouter>
    )
    const infoTable = screen.getByRole('table');
    expect(within(infoTable).getAllByRole('row').length).toBe(1);
  });
  test("Doesn't render contact email if hasEmail is missing", () => {
    const metadataMapping = {
      ...defaultMetadataMapping,
    }
    render(
      <MemoryRouter>
        <DatasetAdditionalInformation
          metadata={{contactPoint: { fn: "Medicaid.gov" }}}
          metadataMapping={metadataMapping}
        />
      </MemoryRouter>
    )
    const infoTable = screen.getByRole('table');
    expect(within(infoTable).getAllByRole('row').length).toBe(1);
    expect(within(infoTable).queryByText('Contact Email')).not.toBeInTheDocument();
  });
  test("Doesn't render contact if fn is missing", () => {
    const metadataMapping = {
      ...defaultMetadataMapping,
    }
    render(
      <MemoryRouter>
        <DatasetAdditionalInformation
          metadata={{contactPoint: { hasEmail: "mailto:Medicaid.gov@cms.hhs.gov" }}}
          metadataMapping={metadataMapping}
        />
      </MemoryRouter>
    )
    const infoTable = screen.getByRole('table');
    expect(within(infoTable).getAllByRole('row').length).toBe(1);
    expect(within(infoTable).queryByText('Contact')).not.toBeInTheDocument();
  });
  test("Doesn't render bureauCode or programCode if length is 0", () => {
    const metadataMapping = {
      ...defaultMetadataMapping,
    }
    render(
      <MemoryRouter>
        <DatasetAdditionalInformation
          metadata={{identifier: '1234', bureauCode: [], programCode: []}}
          metadataMapping={metadataMapping}
        />
      </MemoryRouter>
    )
    const infoTable = screen.getByRole('table');
    expect(within(infoTable).queryByText('Bureau Code')).not.toBeInTheDocument();
    expect(within(infoTable).queryByText('Program Code')).not.toBeInTheDocument();
  });
});
