import React, { useEffect } from 'react';
import { Button } from '@cmsgov/design-system';

const Pagination = ({ totalPages, currentPage, buttonAction }) => {
  const maxLength = 7;
  // Expectation starts at 1
  // only shows 7 buttons plus prev/next

  function addFirst() {
    // extra + 1 is number of siblings
    if (currentPage > 1 + 1) {
      return [{ id: 1, text: 1 }];
    } else {
      return [];
    }
  }

  function addLast() {
    // extra + 1 is number of siblings
    if (currentPage < totalPages) {
      return [{ id: totalPages, text: totalPages }];
    } else {
      return [];
    }
  }

  function addPrev() {
    if (currentPage > 1) {
      return [{ id: 'previous', text: 'Previous' }];
    }
    return [{ id: 'previous', text: 'Previous', disabled: true }];
  }

  function addNext() {
    if (currentPage < totalPages) {
      return [{ id: 'next', text: 'Next' }];
    }
    return [{ id: 'next', text: 'Next', disabled: true }];
  }

  function buildSiblings() {
    // add check if current page less than totalPages
    let siblings = [{ id: currentPage, text: currentPage, currentPage: true }];

    if (currentPage > 1) {
      siblings.unshift({ id: currentPage - 1, text: currentPage - 1 });
    }

    if (currentPage < totalPages - 1) {
      siblings.push({ id: currentPage + 1, text: currentPage + 1 });
    }
    return siblings;
  }

  function buildPreSiblings() {
    let preSiblings = [];
    let remainingSpots = 0;
    if (currentPage === 4) {
      remainingSpots = 1;
      preSiblings.push({ id: '2', text: 2 });
    }
    if (currentPage > 4) {
      remainingSpots = 1;
      preSiblings.push({ id: 'predots', text: '...' });
    }
    if (currentPage > 4 && currentPage >= totalPages - 2) {
      remainingSpots = 1;
      preSiblings.push({ id: totalPages - 4, text: totalPages - 4 });
    }

    if (currentPage > 4 && currentPage >= totalPages - 1) {
      remainingSpots = 1;
      preSiblings.push({ id: totalPages - 3, text: totalPages - 3 });
    }

    if (currentPage > 4 && currentPage === totalPages) {
      remainingSpots = 1;
      preSiblings.push({ id: totalPages - 2, text: totalPages - 2 });
    }

    return preSiblings;
  }

  function buildPostSiblings() {
    let postSiblings = [];
    let remainingSpots = maxLength - (currentPage + 1) - 1;

    if (currentPage < 5) {
      for (let spot = 1; spot < remainingSpots; spot++) {
        // console.log('post-spot', spot)
        postSiblings.push({ id: currentPage + 1 + spot, text: currentPage + 1 + spot });
      }
      postSiblings.push({ id: 'postdots', text: '...' });
    }

    if (currentPage >= 5 && currentPage < totalPages - 3) {
      postSiblings.push({ id: 'postdots', text: '...' });
    }
    if (currentPage >= 5 && currentPage === totalPages - 3) {
      postSiblings.push({ id: totalPages - 1, text: totalPages - 1 });
    }
    return postSiblings;
  }

  function buttonValue(item) {
    if (item === 'Previous') {
      return currentPage - 1;
    }
    if (item === 'Next') {
      return currentPage + 1;
    }
    return item;
  }

  function addAll() {
    let items = [...Array(totalPages)];
    return items.map((item, index) => ({ id: index + 1, text: index + 1 }));
  }

  function buildAll() {
    if (totalPages > 0 && totalPages <= maxLength) {
      return [...addPrev(), ...addAll(), ...addNext()];
    }
    if (totalPages > 0 && totalPages > maxLength) {
      return [
        ...addPrev(),
        ...addFirst(),
        ...buildPreSiblings(),
        ...buildSiblings(),
        ...buildPostSiblings(),
        ...addLast(),
        ...addNext(),
      ];
    }
    return [];
  }

  return (
    <div className="dc-pagination">
      <nav>
        <ol className="ds-u-display--flex ds-u-flex-direction--row ds-u-padding-x--0">
          {buildAll().map((item) => {
            let buttonClass = '';
            let liClass = '';
            if (item.text === 'Previous') {
              buttonClass = 'dc-pagination--previous__button';
              liClass = 'dc-pagination--previous';
            }
            if (item.text === 'Next') {
              buttonClass = 'dc-pagination--next__button';
              liClass = 'dc-pagination--next';
            }
            if (item.currentPage || item.text === currentPage) {
              buttonClass = 'dc-pagination-current__button';
            }
            return (
              <li key={item.id} className={liClass}>
                {item.id === 'postdots' || item.id === 'predots' ? (
                  <span>{item.text}</span>
                ) : (
                  <Button
                    className={buttonClass}
                    disabled={item.disabled ? item.disabled : false}
                    size="small"
                    variation="transparent"
                    onClick={() => buttonAction(buttonValue(item.text))}
                  >
                    {item.text}
                  </Button>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Pagination;
