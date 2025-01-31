import { Accordion, AccordionItem } from '@cmsgov/design-system';

export default function ApiRowLimitNotice() {
  return (
    <div className="ds-u-padding-top--3">
      <Accordion bordered>
        <AccordionItem key="1" heading="Row Limit Warning">
          <p>
            If you receive a 500 response from your API query it is most likely due to memory
            exhaustion. You may see a "Temporarily Unavailable" message. Make sure you include a
            limit appropriate to the speed of your connection, HTTP calls will time out if set too
            high and payloads for high limits can be very large. Complex queries should include a
            smaller limit value. Use the <strong>limit</strong> and <strong>offset</strong>{' '}
            parameters to iterate through result sets that are larger than the row limit when
            running queries against the datastore API.
          </p>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
