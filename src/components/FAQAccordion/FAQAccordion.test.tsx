import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  describe('callbacks', () => {
    const onItemToggle = jest.fn();
    const onToggleAll = jest.fn();

    beforeEach(() => {
      onItemToggle.mockClear();
      onToggleAll.mockClear();
    });

    it('reports the item id and new open state when an item is expanded', async () => {
      const user = userEvent.setup();
      render(<FAQAccordion faqs={faqs} onItemToggle={onItemToggle} />);
      await user.click(screen.getByRole('button', { name: 'Question one' }));
      expect(onItemToggle).toHaveBeenCalledTimes(1);
      expect(onItemToggle).toHaveBeenCalledWith('a', true);
    });

    it('reports the collapsed state when the same item is toggled twice', async () => {
      const user = userEvent.setup();
      render(<FAQAccordion faqs={faqs} onItemToggle={onItemToggle} />);
      const button = screen.getByRole('button', { name: 'Question one' });
      await user.click(button);
      await user.click(button);
      expect(onItemToggle).toHaveBeenCalledTimes(2);
      expect(onItemToggle).toHaveBeenNthCalledWith(2, 'a', false);
    });

    it('reports true when expand all is used', async () => {
      const user = userEvent.setup();
      render(<FAQAccordion faqs={faqs} onToggleAll={onToggleAll} />);
      await user.click(screen.getByRole('button', { name: 'Expand all FAQs' }));
      expect(onToggleAll).toHaveBeenCalledTimes(1);
      expect(onToggleAll).toHaveBeenCalledWith(true);
    });

    it('reports false when collapse all is used', async () => {
      const user = userEvent.setup();
      render(<FAQAccordion faqs={faqs} onToggleAll={onToggleAll} />);
      await user.click(screen.getByRole('button', { name: 'Expand all FAQs' }));
      await user.click(screen.getByRole('button', { name: 'Collapse all FAQs' }));
      expect(onToggleAll).toHaveBeenNthCalledWith(2, false);
    });

    it('does not emit per-item events when toggling all', async () => {
      const user = userEvent.setup();
      render(
        <FAQAccordion faqs={faqs} onItemToggle={onItemToggle} onToggleAll={onToggleAll} />
      );
      await user.click(screen.getByRole('button', { name: 'Expand all FAQs' }));
      expect(onToggleAll).toHaveBeenCalledWith(true);
      expect(onItemToggle).not.toHaveBeenCalled();
    });

    it('reports false from the toggle all button after every item was opened individually', async () => {
      const user = userEvent.setup();
      render(<FAQAccordion faqs={faqs} onToggleAll={onToggleAll} />);
      await user.click(screen.getByRole('button', { name: 'Question one' }));
      await user.click(screen.getByRole('button', { name: 'Question two' }));
      await user.click(screen.getByRole('button', { name: 'Question three' }));
      await user.click(screen.getByRole('button', { name: 'Collapse all FAQs' }));
      expect(onToggleAll).toHaveBeenCalledTimes(1);
      expect(onToggleAll).toHaveBeenCalledWith(false);
    });

    it('toggles without throwing when no callbacks are supplied', async () => {
      const user = userEvent.setup();
      render(<FAQAccordion faqs={faqs} />);
      await user.click(screen.getByRole('button', { name: 'Question one' }));
      await user.click(screen.getByRole('button', { name: 'Expand all FAQs' }));
      expect(screen.getByRole('button', { name: 'Collapse all FAQs' })).toBeInTheDocument();
    });
  });
});
