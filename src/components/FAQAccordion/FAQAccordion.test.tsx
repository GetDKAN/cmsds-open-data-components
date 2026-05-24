import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FAQAccordion from './index';

const faqs = [
  { id: 'a', title: 'Question one', body: <p>Answer one</p>, open: false },
  { id: 'b', title: 'Question two', body: <p>Answer two</p>, open: false },
  { id: 'c', title: 'Question three', body: <p>Answer three</p>, open: false },
];

describe('FAQAccordion', () => {
  it('renders every FAQ heading', () => {
    render(<FAQAccordion faqs={faqs} />);
    expect(screen.getByRole('button', { name: 'Question one' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Question two' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Question three' })).toBeInTheDocument();
  });

  it('starts with the "Expand all" button label', () => {
    render(<FAQAccordion faqs={faqs} />);
    expect(screen.getByRole('button', { name: 'Expand all FAQs' })).toBeInTheDocument();
  });

  it('toggles to "Collapse all" after clicking expand all', async () => {
    const user = userEvent.setup();
    render(<FAQAccordion faqs={faqs} />);
    await user.click(screen.getByRole('button', { name: 'Expand all FAQs' }));
    expect(screen.getByRole('button', { name: 'Collapse all FAQs' })).toBeInTheDocument();
  });

  it('reflects open state via aria-expanded on a single item toggle', async () => {
    const user = userEvent.setup();
    render(<FAQAccordion faqs={faqs} />);
    const button = screen.getByRole('button', { name: 'Question one' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('flips back to "Expand all" once a single open item is collapsed again', async () => {
    const user = userEvent.setup();
    render(<FAQAccordion faqs={faqs} />);
    await user.click(screen.getByRole('button', { name: 'Expand all FAQs' }));
    // Closing one item should toggle global state back to collapsed (not all open).
    await user.click(screen.getByRole('button', { name: 'Question one' }));
    expect(screen.getByRole('button', { name: 'Expand all FAQs' })).toBeInTheDocument();
  });
});
