import React from 'react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Pagination from './index';

const TestComponent = ({ total, current }) => {
  const [totalPages, setTotalPages] = React.useState(total);
  const [itemsPerPage, setItemsPerPage] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(current);
  return (
    <div>
      <button onClick={() => setTotalPages(10)}>10 pages</button>
      <button onClick={() => setTotalPages(30)}>30 pages</button>
      <Pagination currentPage={currentPage} totalPages={totalPages} buttonAction={setCurrentPage} />
    </div>
  );
};

describe('<Pagination />', () => {
  /*
  test('renders with 3 items', async () => {
    const buttonClick = jest.fn();
    const { container } = render(<TestComponent total={10} current={1} />);

    const initialPages = ['1', '2', '3', '4', '5', '...', '10'];
    const initialHidden = ['6', '7', '8', '9'];

    const middlePages = ['1', '4', '5', '6', '10'];
    const middlePages2 = ['1', '5', '6', '7', '10'];
    const middleHidden = ['2', '3', '4', '8', '9'];

    const endingPages = ['1', '...', '6', '7', '8', '9', '10'];
    const endingHidden = ['2', '3', '4', '5'];
    initialPages.forEach((page) => expect(screen.getByText(page)).toBeInTheDocument());
    initialHidden.forEach((page) => expect(screen.queryByText(page)).not.toBeInTheDocument());
    // CLICK THROUGH EACH BUTTON TO MAKE SURE THE CORRECT PAGE BUTTONS ARE SHOWN
    await act(async () => {
      userEvent.click(screen.getByText('2'));
    });
    initialPages.forEach((page) => expect(screen.getByText(page)).toBeInTheDocument());
    await act(async () => {
      userEvent.click(screen.getByText('3'));
    });
    initialPages.forEach((page) => expect(screen.getByText(page)).toBeInTheDocument());
    await act(async () => {
      userEvent.click(screen.getByText('4'));
    });
    initialPages.forEach((page) => expect(screen.getByText(page)).toBeInTheDocument());
    await act(async () => {
      userEvent.click(screen.getByText('5')); // 1 ... 4 5 6 ... 10
    });
    middlePages.forEach((page) => expect(screen.getByText(page)).toBeInTheDocument());

    expect(screen.getAllByText('...').length).toBe(2);
    await act(async () => {
      userEvent.click(screen.getByText('6')); // 1 ... 4 5 6 ... 10
    });
    middlePages2.forEach((page) => expect(screen.getByText(page)).toBeInTheDocument());
    expect(screen.getAllByText('...').length).toBe(2);

    await act(async () => {
      userEvent.click(screen.getByText('7')); // 1 ... 4 5 6 ... 10
    });
    endingPages.forEach((page) => expect(screen.getByText(page)).toBeInTheDocument());

    await act(async () => {
      userEvent.click(screen.getByText('8')); // 1 ... 4 5 6 ... 10
    });
    endingPages.forEach((page) => expect(screen.getByText(page)).toBeInTheDocument());

    await act(async () => {
      userEvent.click(screen.getByText('9')); // 1 ... 4 5 6 ... 10
    });
    endingPages.forEach((page) => expect(screen.getByText(page)).toBeInTheDocument());

    await act(async () => {
      userEvent.click(screen.getByText('10')); // 1 ... 4 5 6 ... 10
    });
    endingPages.forEach((page) => expect(screen.getByText(page)).toBeInTheDocument());
  });
  */

  test.skip('MaxLength pages show all', async () => {
    const buttonClick = jest.fn();
    const { container } = render(<TestComponent total={7} current={1} />);
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByText('4'));
    });
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  test.skip('works with one page', async () => {
    const buttonClick = jest.fn();
    const { container } = render(<TestComponent total={1} current={1} />);
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByText('1'));
    });
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  /*

  test('pagination buttons update when total pages changes', async () => {
    const buttonClick = jest.fn();
    const { container } = render(<TestComponent total={10} current={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    await act(async () => {
      userEvent.click(screen.getByText('30 pages')); // 1 ... 4 5 6 ... 10
    });
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.queryByText('10')).not.toBeInTheDocument();
  }); */

  test.skip('Can use next/prev button', async () => {
    const { container } = render(<TestComponent total={10} current={1} />);
    // INITIAL STATE ON PAGE 1
    expect(screen.queryByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).not.toBeDisabled();
    // CLICK NEXT TO PAGE 2
    await act(async () => {
      userEvent.click(screen.getByText('Next'));
    });
    expect(screen.getByText('Previous')).not.toBeDisabled();
    expect(screen.getByText('Next')).not.toBeDisabled();
    // CLICK PREVIOUS BACK TO PAGE 1
    await act(async () => {
      userEvent.click(screen.getByText('Previous'));
    });
    expect(screen.queryByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).not.toBeDisabled();
    // JUMP TO LAST PAGE
    await act(async () => {
      userEvent.click(screen.getByText('10'));
    });
    expect(screen.getByText('Previous')).not.toBeDisabled();
    expect(screen.queryByText('Next')).toBeDisabled();
    // CLICK PREVIOUS TO PAGE 9
    await act(async () => {
      userEvent.click(screen.getByText('Previous'));
    });
    expect(screen.getByText('Previous')).not.toBeDisabled();;
    expect(screen.getByText('Next')).not.toBeDisabled();
    // CLICK NEXT TO PAGE 10
    await act(async () => {
      userEvent.click(screen.getByText('Next'));
    });
    expect(screen.getByText('Previous')).not.toBeDisabled();
    expect(screen.queryByText('Next')).toBeDisabled();
  });
});
