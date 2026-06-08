import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from './index';

describe('SearchInput', () => {
  it('omits the magnifying-glass icon and search button by default', () => {
    const { container } = render(<SearchInput placeholder="Search the Data" />);
    expect(container.querySelector('.magnifying-glass-icon')).toBeNull();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders the magnifying-glass icon and submit button when their flags are set', () => {
    const onSubmit = jest.fn();
    const { container } = render(
      <SearchInput
        showMagnifyingGlass
        showSearchButton
        onSubmit={onSubmit}
        onDark
      />,
    );
    expect(container.querySelector('.magnifying-glass-icon')).not.toBeNull();
    const submit = screen.getByRole('button');
    expect(submit).toHaveClass('on-dark');
    fireEvent.click(submit);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('forwards onChange events from the text input', () => {
    const onChange = jest.fn();
    render(<SearchInput onChange={onChange} placeholder="Search the Data" />);
    fireEvent.change(screen.getByLabelText('Search the Data'), {
      target: { value: 'widgets' },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
