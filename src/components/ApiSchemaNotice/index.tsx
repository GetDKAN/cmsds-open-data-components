import React from 'react';
import { Accordion, AccordionItem } from '@cmsgov/design-system';

export default function ApiSchemaNotice() {
  return (
    <div className="ds-u-margin-y--3">
      <Accordion bordered>
        <AccordionItem key="1" heading="Change to the data.json endpoint">
          <p>
            <strong>PLEASE NOTE:</strong>
          </p>
          <p>
            This site will be publishing its metadata catalog, available at [/data.json], using the new DCAT-US v3.0 standard starting from September 2026.
          </p>
          <p>
            The legacy DCAT-US 1.1 catalog endpoint is still available and can now be found here: [/v1-1-data.json].
          </p>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
