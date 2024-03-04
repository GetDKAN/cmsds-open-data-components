import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import MobileHeader from './index';
import { MemoryRouter } from 'react-router-dom';
import mockLinks from '../../../__mocks__/mockLinks.js';

describe('<MobileHeader />', () => {

  test('Should trap focus within the mobile menu'  
  
, () => {
    render(
      <MemoryRouter>
        <MobileHeader
          links={mockLinks}
        />
      </MemoryRouter>
      );
    /**
   * findParentByTestId is a helper function used in testing. Jest can't simply use JS's `closest()`
   *
   * The function accepts a DOM node and a string as parameters. Starting from the passed node,
   * it checks each parent node to see if it has a 'data-testid' attribute that matches the passed testId string.
   *
   * @param {Object} node - DOM node from which to start the search
   * @param {string} testId - The 'data-testid' value to match
   * @returns {Object|null} - Returns the found parent node or null if no matching parent node is found
   */
    function findParentByTestId(node, testId) {
      let currentNode = node;
      while (currentNode) {
        if (currentNode.dataset && currentNode.dataset.testid === testId) {
          // Found a match
          return currentNode;
        }
        currentNode = currentNode.parentNode;
      }
      // No match found
      return null;
    }
    
    const mobileMenu = screen.getByTestId('mobile-menu');
    const lastElement = within(mobileMenu).getAllByRole('link').pop()
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    lastElement.focus();
    fireEvent.keyDown(lastElement, { key: 'Tab', code: 'Tab' });
    const focusedElement = document.activeElement;
    const mobileMenuElement = findParentByTestId(focusedElement, 'mobile-menu')
    expect(mobileMenuElement).not.toBeNull();
  });
});
