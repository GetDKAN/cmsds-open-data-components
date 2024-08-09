import React from 'react';
import { FAQItemType } from '../../types/misc';
import { Accordion, AccordionItem, Button } from "@cmsgov/design-system";

type FAQProps = {
  faqs: FAQItemType[]
}

const FAQAccordion = (props: FAQProps) => {
  const { faqs } = props;
  const [expanded, setExpanded] = React.useState(false);
  const [faqItems, setFaqItems] = React.useState(faqs);

  function toggleAll() {
    if (expanded) {
      const newFaqs = faqItems.map((item) => ({...item, open: false}));
      setFaqItems(newFaqs);
      setExpanded(false);
    } else {
      const newFaqs = faqItems.map((item) => ({...item, open: true}));
      setFaqItems(newFaqs);
      setExpanded(true);
    }
  }

  function toggleAccordionItem(id: string) {
    const currentFaqIndex = faqItems.findIndex((item) => item.id === id);
    const updatedFaq = {
      ...faqItems[currentFaqIndex],
      open: !faqItems[currentFaqIndex].open
    }

    const newFaqs = [
      ...faqItems.slice(0, currentFaqIndex),
      updatedFaq,
      ...faqItems.slice(currentFaqIndex + 1)
    ]
    setFaqItems(newFaqs);

    const openCount = newFaqs.filter((item) => item.open === true).length;
    if (openCount > 0 && openCount == newFaqs.length) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }

  return(
    <div>
      <Button className='ds-u-margin-y--2 ds-u-float--right' type="button" variation='ghost' onClick={() => toggleAll()}>
        {`${expanded ? 'Collapse' : 'Expand'} all FAQs`}
      </Button>
      <Accordion>
        {faqItems.map((faq) => (
          <AccordionItem
            key={faq.id}
            heading={faq.title}
            isControlledOpen={faq.open}
            onChange={() => toggleAccordionItem(faq.id)}
          >
            {faq.body}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQAccordion;
