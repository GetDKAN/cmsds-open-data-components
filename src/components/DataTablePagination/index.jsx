import React from 'react';
import { Button } from '@cmsgov/design-system';

const DataTablePagination = ({
    nextPage,
    canNextPage,
    previousPage,
    canPreviousPage
  }) => {
  function buildGoToButtons() {
    let buttons = []
    for (let i = 1; i < 6; i++) {
      buttons.push(i);
    }
    return buttons;
  }
  const goToButtons = buildGoToButtons();

  return (
    <div>
      <button onClick={() => previousPage()} disabled={!canPreviousPage}>
        {'<'}
      </button>
      {goToButtons.map((b) => <Button>{b}</Button>)}
      <button onClick={() => nextPage()} disabled={!canNextPage}>
        {'>'}
      </button>
    </div>
  )
}

export default DataTablePagination;
