import React, { useContext } from "react";
import { Tooltip, Dropdown } from "@cmsgov/design-system";
import DataTableContext from "../../templates/Dataset/DataTableContext";
import { DataTableActionsContext } from "../DatasetTableTab/DataTableActionsContext";
import { ResourceType } from "../../types/dataset";

import "./DisplaySettings.scss";

const DisplaySettings: React.FC = () => {
  const { resource } = useContext(DataTableContext);
  const { limit, setLimit, setOffset } = resource as ResourceType;
  const { setPage, tableDensity, setTableDensity } = useContext(DataTableActionsContext);
  const rowOptions = [10, 25, 50, 100];

  if (!resource) return null;

  return (
    <div className="dkan-display-settings-wrapper">
      <Tooltip
        className="dkan-filter-dataset-toolbar-button ds-u-display--flex ds-u-align-items--center ds-u-color--primary ds-u-border--0 ds-u-padding--0 ds-u-padding-x--2 ds-u-margin--0 ds-u-fill--transparent ds-u-font-size--sm"
        activeClassName="dkan-data-table-display-settings-tooltip-open"
        dialog
        offset={[
          0,
          5
        ]}
        placement="bottom-start"
        maxWidth="350px"
        ariaLabel="Display Settings"
        title={
          <div className="ds-u-display--flex ds-u-flex-direction--column">
            <div className="dkan-data-table-display-settings-row ds-u-padding-bottom--1">
              <div className="">
                <span className="ds-u-font-size--md ds-u-font-weight--normal">Row height</span>
              </div>
              <div className="ds-u-display--flex ds-u-align-items--start">
                <button
                  onClick={() => setTableDensity('expanded')}
                  aria-label="Row height, Expanded"
                  className={`dkan-table-density-button ds-u-leading--reset ds-u-padding--1 ds-u-margin--0 ${tableDensity === 'expanded' ? 'active ds-u-fill--primary-lightest' : ''}`}
                >
                  <i className="ds-u-display--block">
                    <svg className="ds-u-display--block"viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" height="16" role="img" width="16">
                      <path d="M496,384 C504.836556,384 512,391.163444 512,400 L512,496 C512,504.836556 504.836556,512 496,512 L16,512 C7.163444,512 1.082166e-15,504.836556 0,496 L0,400 C-1.082166e-15,391.163444 7.163444,384 16,384 L496,384 Z M496,192 C504.836556,192 512,199.163444 512,208 L512,304 C512,312.836556 504.836556,320 496,320 L16,320 C7.163444,320 1.082166e-15,312.836556 0,304 L0,208 C-1.082166e-15,199.163444 7.163444,192 16,192 L496,192 Z M496,0 C504.836556,-1.623249e-15 512,7.163444 512,16 L512,112 C512,120.836556 504.836556,128 496,128 L16,128 C7.163444,128 1.082166e-15,120.836556 0,112 L0,16 C-1.082166e-15,7.163444 7.163444,1.623249e-15 16,0 L496,0 Z"></path>
                    </svg>
                  </i>
                </button>
                <button
                  onClick={() => setTableDensity('normal')}
                  aria-label="Row height, Normal"
                  className={`dkan-table-density-button ds-u-leading--reset ds-u-padding--1 ds-u-margin--0 ${tableDensity === 'normal' ? 'active ds-u-fill--primary-lightest' : ''}`}
                >
                  <i className="ds-u-display--block">
                    <svg className="ds-u-display--block" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" height="16" role="img" width="16">
                      <path d="M496,416 C504.836556,416 512,423.163444 512,432 L512,496 C512,504.836556 504.836556,512 496,512 L16,512 C7.163444,512 1.082166e-15,504.836556 0,496 L0,432 C-1.082166e-15,423.163444 7.163444,416 16,416 L496,416 Z M496,277 C504.836556,277 512,284.163444 512,293 L512,357 C512,365.836556 504.836556,373 496,373 L16,373 C7.163444,373 1.082166e-15,365.836556 0,357 L0,293 C-1.082166e-15,284.163444 7.163444,277 16,277 L496,277 Z M496,139 C504.836556,139 512,146.163444 512,155 L512,219 C512,227.836556 504.836556,235 496,235 L16,235 C7.163444,235 1.082166e-15,227.836556 0,219 L0,155 C-1.082166e-15,146.163444 7.163444,139 16,139 L496,139 Z M496,0 C504.836556,-1.623249e-15 512,7.163444 512,16 L512,80 C512,88.836556 504.836556,96 496,96 L16,96 C7.163444,96 1.082166e-15,88.836556 0,80 L0,16 C-1.082166e-15,7.163444 7.163444,1.623249e-15 16,0 L496,0 Z"></path>
                    </svg>
                  </i>
                </button>
                <button
                  onClick={() => setTableDensity('compact')}
                  aria-label="Row height, Compact"
                  className={`dkan-table-density-button ds-u-leading--reset ds-u-padding--1 ds-u-margin--0 ${tableDensity === 'compact' ? 'active ds-u-fill--primary-lightest ' : ''}`}
                >
                  <i className="ds-u-display--block">
                    <svg className="ds-u-display--block" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" height="16" role="img" width="16">
                      <path d="M496,448 C504.836556,448 512,455.163444 512,464 L512,496 C512,504.836556 504.836556,512 496,512 L16,512 C7.163444,512 1.082166e-15,504.836556 0,496 L0,464 C-1.082166e-15,455.163444 7.163444,448 16,448 L496,448 Z M496,336 C504.836556,336 512,343.163444 512,352 L512,384 C512,392.836556 504.836556,400 496,400 L16,400 C7.163444,400 1.082166e-15,392.836556 0,384 L0,352 C-1.082166e-15,343.163444 7.163444,336 16,336 L496,336 Z M496,224 C504.836556,224 512,231.163444 512,240 L512,272 C512,280.836556 504.836556,288 496,288 L16,288 C7.163444,288 1.082166e-15,280.836556 0,272 L0,240 C-1.082166e-15,231.163444 7.163444,224 16,224 L496,224 Z M496,112 C504.836556,112 512,119.163444 512,128 L512,160 C512,168.836556 504.836556,176 496,176 L16,176 C7.163444,176 1.082166e-15,168.836556 0,160 L0,128 C-1.082166e-15,119.163444 7.163444,112 16,112 L496,112 Z M496,0 C504.836556,-1.623249e-15 512,7.163444 512,16 L512,48 C512,56.836556 504.836556,64 496,64 L16,64 C7.163444,64 1.082166e-15,56.836556 0,48 L0,16 C-1.082166e-15,7.163444 7.163444,1.623249e-15 16,0 L496,0 Z"></path>
                    </svg>
                  </i>
                </button>
              </div>
            </div>
            <div className="dkan-data-table-display-settings-row ds-u-border-top--1 ds-u-padding-top--1">
              <div className="">
                <span className="ds-u-font-size--md ds-u-font-weight--normal">Rows per page</span>
              </div>
              <Dropdown
                className=""
                options={rowOptions.map((row) => ({ label: row.toString(), value: row }))}
                size="medium"
                label="Rows per page:"
                labelClassName="ds-u-margin-top--0 ds-u-font-size--md ds-u-font-weight--normal"
                name="datatable_rows_per_page"
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                  setPage(1);
                  setOffset(0);
                }}
                value={limit.toString()}
                defaultValue={limit.toString()}
              />
            </div>
          </div>
        }
      >
        <i className="far fa-sliders-h ds-u-margin-right--1"></i>
        <span className="ds-u-display--none ds-u-lg-display--inline-block">Display Settings</span>
        <i className="fa fa-chevron-down ds-u-margin-left--1 ds-u-font-weight--bold"></i>
        <i className="fa fa-chevron-up ds-u-margin-left--1 ds-u-font-weight--bold"></i>
      </Tooltip>
    </div>
  )
}

export default DisplaySettings;