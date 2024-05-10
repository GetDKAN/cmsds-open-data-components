import React from 'react';
import { defaultMetadataMapping } from './metadataMapping';
import TransformedDate from '../components/TransformedDate';
import * as dataset from '../tests/fixtures/dataset.json';


describe('defaultMetadataMapping', () => {
  test("Date Mapping return TransformedDate component", () => {
    expect(defaultMetadataMapping.modified(dataset.modified)).toEqual([{
      label: "Modified",
      value: <TransformedDate date="2024-01-16T18:50:39+00:00" />
    }]);
    // expect(defaultMetadataMapping.issued(dataset.issued)).toEqual([{
    //   label: "Issued",
    //   value: <TransformedDate date="2015-08-19T22:29:45+00:00" />
    // }]);
  });
  // test("Strings are returned properly", () => {
  //   expect(defaultMetadataMapping.accrualPeriodicity(dataset.accrualPeriodicity)).toEqual([{
  //     label: "Frequency",
  //     value: "Decennial"
  //   }]);
  //   expect(defaultMetadataMapping.identifier(dataset.identifier)).toEqual([{
  //     label: "Identifier",
  //     value: "4eaa5ebe-62f7-402e-a407-963cd380688b"
  //   }]);
  //   expect(defaultMetadataMapping.bureauCode(dataset.bureauCode)).toEqual([{
  //     label: "Bureau Code",
  //     value: "009:00"
  //   }]);
  //   expect(defaultMetadataMapping.programCode(dataset.programCode)).toEqual([{
  //     label: "Program Code",
  //     value: "009:000"
  //   }]);
  //   expect(defaultMetadataMapping.accessLevel(dataset.accessLevel)).toEqual([{
  //     label: "Public Access Level",
  //     value: "public"
  //   }]);
  //   expect(defaultMetadataMapping.spatial(dataset.spatial)).toEqual([{
  //     label: "Spacial/Geographical Coverage",
  //     value: "Florida"
  //   }]);
  // });
  // test("HTML is returned", () => {
  //   expect(defaultMetadataMapping.temporal(dataset.temporal)).toEqual([{
  //     label: "Temporal Coverage",
  //     value: <span className="dc-c-word-break--all">2022-01-01/2022-12-31</span>
  //   }]);
  //   // expect(defaultMetadataMapping.license(dataset.license)).toEqual([{
  //   //   label: "License",
  //   //   value: <a href="http://www.usa.gov/publicdomain/label/1.0/">http://www.usa.gov/publicdomain/label/1.0/</a>
  //   // }]);
  //   // expect(defaultMetadataMapping.references(dataset.references)).toStrictEqual([{
  //   //   label: "Related Documents",
  //   //   value:  <ul className="ds-u-margin--0 ds-u-padding-y--0 ds-u-padding-left--2 ds-u-padding-right--0"><li><a href="https://test.com">https://test.com</a></li><li><a href="https://test-2.com">https://test-2.com</a></li></ul>
  //   // }]);
  // });
  // test("Contact point array is returned", () => {
    
  // });
  // test("Theme and Keywords are returned", () => {
    
  // });

  // test("Publisher returns the correct object or empty array", () => {

  //   expect(defaultMetadataMapping.publisher(dataset.publisher)).toEqual([{
  //     label: "Publisher",
  //     value: "data.medicaid.gov"
  //   }]);
  //   expect(defaultMetadataMapping.publisher({data: { id: 1}})).toEqual([]);
  //   expect(defaultMetadataMapping.publisher({})).toEqual([]);
  // });
});