import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResourceFooter from './index';

const makeResource = (overrides = {}) => ({
  limit: 25,
  offset: 0,
  count: 100,
  values: [{ a: 1 }, { a: 2 }],
  setOffset: jest.fn(),
  ...overrides,
});

describe('ResourceFooter', () => {
  it('renders no pagination when values is empty', () => {
    const { container } = render(<ResourceFooter resource={makeResource({ values: [] })} />);
    expect(container.querySelector('.ds-c-pagination')).toBeNull();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders pagination and computes new offset as (page - 1) * limit on page change', () => {
    const resource = makeResource({ limit: 25, offset: 0, count: 100 });
    render(<ResourceFooter resource={resource} />);
    // CMSDS Pagination renders numbered pages as <button aria-label="page N">.
    const page3 = screen.getByRole('button', { name: /page 3/i });
    fireEvent.click(page3);
    expect(resource.setOffset).toHaveBeenCalledWith(50); // (3 - 1) * 25
  });
});
