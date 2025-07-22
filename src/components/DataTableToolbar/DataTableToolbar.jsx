import React, { useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// import ManageColumns from '../../ManageColumns/ManageColumns';
import './DataTableToolbar.scss';
// import { useCurrentBreakpointName, useCurrentWidth } from 'react-socks';

const DataTableToolbar = ({ }) => {
  
const fullscreen = true; // This is a placeholder, replace with actual fullscreen logic if needed
  return (
    <div>
      <div
        className={`resource-table-header${fullscreen ? ' fullscreen-resource-table-header' : ''}`}
      >
       
        <div
          className={`resource-table-header-container${
            fullscreen ? ' fullscreen-resource-table-header-container' : ''
          }`}
        >
          <h1>Test</h1>
          {/* ChoiceList now only takes types for radio or checkboxes. ChoiceList has been converted to an html select component */}
          <div className={`table-controls${fullscreen ? ' fullscreen-table-controls' : ''}`}></div>
        </div>
      </div>
      <p className="resize-help">
        Activate the column resize button and use the right and left arrow keys to resize a column
        or use your mouse to drag/resize. Press escape to cancel the resizing.
      </p>
    </div>
  );
};


DataTableToolbar.displayName = 'DataTableToolbar';
export default DataTableToolbar;
