import React, { useEffect, useState, useContext } from "react";
import qs from 'qs';
import { buildOperatorOptions, buildCustomColHeaders } from "../../templates/FilteredResource/functions";
import { Dialog, Button } from "@cmsgov/design-system";
import { ConditionType } from "../../types/dataset";
import DataTableContext from "../../templates/Dataset/DataTableContext";
import { DataTableActionsContext } from "../DatasetTableTab/DataTableActionsContext";
import { DatasetTableTabProps, prepareColumns } from "../DatasetTableTab";
import FilterItem from "./FilterItem";
import ClearFiltersButton from "../QueryBuilder/ClearFiltersButton";

import './FilterDataset.scss'

function updateQueryForDatastore(condition: ConditionType) {
  let cond = condition;
  delete cond.key;
  if (cond.operator === '=' || cond.operator === '<>') {
    if (Array.isArray(cond.value)) {
      cond.value = cond.value.join();
    }
    cond.value = cond.value.replace(/(^\%+|\%+$)/gm, '');
  }
  if (cond.operator.toLowerCase() === 'like') {
    if (Array.isArray(cond.value)) {
      cond.value = cond.value.join();
    }
    const cleanedValue = cond.value.replace(/(^\%+|\%+$)/gm, '');
    cond.value = `%${cleanedValue}%`;
  }
  if (cond.operator.toLowerCase() === 'in') {
    if (!Array.isArray(cond.value)) {
      cond.value = cond.value.split(',');
    }
  }
  if (Array.isArray(cond.value)) {
    cond.value = cond.value.map((v) => v.trim().replace(/(^\%+|\%+$)/gm, ''));
  }
  return cond;
}

const FilterDataset: React.FC = () => {
  const {
    distribution,
    resource,
    customColumns = [],
  } = useContext(DataTableContext) as DatasetTableTabProps;

  const { setPage } = useContext(DataTableActionsContext);

  if (!resource) return null;

  const customColumnHeaders = buildCustomColHeaders(
    customColumns,
    resource.columns,
    resource.schema[distribution.identifier]
  );

  const id = distribution.identifier;
  const columns = customColumnHeaders
    ? customColumnHeaders
    : prepareColumns(resource.columns, resource.schema[id]);

  const { conditions, schema, setConditions, setOffset } = resource;
  const fields = Object.keys(schema[id].fields);

  const [queryConditions, setQueryConditions] = useState<Array<ConditionType>>([]);
  const [titleConditions, setTitleConditions] = useState<Array<ConditionType>>([]);
  const [conditionsChanged, setConditionsChanged] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const syncConditions = () => {
    if (conditions && conditions.length) {
      const keyedConditions = conditions.map((oc) => ({
        ...oc,
        key: Date.now().toString() + oc.value + oc.property,
      }));
      setQueryConditions(keyedConditions);
    } else {
      setQueryConditions([
        {
          property: fields[0],
          value: '',
          operator: buildOperatorOptions(schema[id].fields[fields[0]].mysql_type)[0].value,
          key: Date.now().toString(),
        },
      ])
    }
  }

  const addCondition = (condition: Array<ConditionType> | ConditionType | null) => {
    if (Array.isArray(condition)) {
      const keyedConditions = condition.map((oc) => ({
        ...oc,
        key: Date.now().toString() + oc.value + oc.property,
      }));
      setQueryConditions(keyedConditions);
    } else {
      setQueryConditions([
        ...queryConditions,
        {
          property: fields[0],
          value: '',
          operator: buildOperatorOptions(schema[id].fields[fields[0]].mysql_type)[0].value,
          key: Date.now().toString(),
        },
      ]);
    }
  };

  // Sync the UI with the actual data conditions whenever those change
  useEffect(() => {
    syncConditions();
    setTitleConditions(conditions);
  }, [conditions]);

  const propertyOptions = fields.map((f) => {
    if (schema[id].fields[f].description) {
      return { label: schema[id].fields[f].description, value: f };
    }
    return { label: f, value: f };
  });

  const updateBrowserURL = (newConditions: Array<ConditionType>) => {
    const url = new URL(window.location.href);
    const urlString = qs.stringify(
      { conditions: newConditions },
      { encodeValuesOnly: true, addQueryPrefix: true }
    );
    window.history.pushState({}, '', `${url.origin}${url.pathname}${urlString}`);
  }

  const submitConditions = () => {
    // only update the data conditions when "Apply filters" is pressed
    const submitConditions = queryConditions
      .filter((oc: ConditionType) => {
        if (oc.property) {
          return oc;
        }
        return false;
      })
      .map((oc) => {
        let cond = Object.assign({}, oc);
        return updateQueryForDatastore(cond);
      });
    
    const completeConditions = conditionsReadyToSubmit(submitConditions);
    
    if (completeConditions.length) { // Safeguard but there should always be at least one 
      setConditions(completeConditions);
      setPage(1);
      setOffset(0);
      setConditionsChanged(false);
      updateBrowserURL(completeConditions as ConditionType[]);
      setModalOpen(false);
    }
  };

  const conditionsReadyToSubmit = (conditions: ConditionType[]) => {
    const isEmpty = (val: string | string[] | undefined) => {
      if (typeof val === "string") {
        return val.trim() === "";
      }

      if (Array.isArray(val)) {
        return val.length === 0;
      }

      return true;
    };

    const completeConditions = conditions.filter(condition => {
      if (condition) {
        if (!isEmpty(condition.property) && !isEmpty(condition.operator) && !isEmpty(condition.value)) {
          return condition;
        }
      }
    });

    return completeConditions;
  }

  const updateCondition = (index: number, key: string, value: string) => {
    let newConditions = [...queryConditions];
    newConditions[index][key] = value;
    setQueryConditions(newConditions);
    setConditionsChanged(true);
  };

  const removeCondition = (index: number) => {
    // just removes the condition from the UI - "Apply Filters" must be clicked to change the data model
    let newConditions = queryConditions.map((oc) => Object.assign({}, oc));
    newConditions.splice(index, 1);
    setQueryConditions(newConditions);
    setConditionsChanged(true);

    if (newConditions.length === 0) {
      setConditions([]);
      updateBrowserURL([]);
    }
  };

  const disableFilterSubmitButton = () => {
    return !conditionsChanged || queryConditions.length === 0 || conditionsReadyToSubmit(queryConditions).length === 0;
  }

  return (
    <>
      {(Object.keys(resource).length && columns.length && resource.schema && Object.keys(distribution).length) ? (
        <div className="dkan-filter-dataset-wrapper">
          <button
            aria-haspopup="dialog"
            className="dkan-filter-dataset-toolbar-button ds-u-color--primary ds-u-text-decoration--underline ds-u-font-size--sm ds-u-padding-x--2 ds-u-margin--0 ds-u-border--0 ds-u-fill--transparent"
            onClick={() => {
              setModalOpen(true)
            }}
          >
            <i className="fa fa-filter ds-u-margin-right--1"></i>
            <span>
              <span className="dkan-dataset-toolbar-button-label">
                {conditions.length > 0
                  ? `Edit Filters`
                  : 'Filter Dataset'
                }
              </span>
              {conditions.length > 0 && ` (${conditions.length})`}
            </span>
          </button>
          <div className={`ds-c-dialog-wrap${modalOpen ? ' open' : ''}`}>
            <Dialog
              heading="Filter Dataset"
              isOpen={modalOpen}
              onExit={() => {
                setModalOpen(false);
                // Defer to run after Dialog's useLayoutEffect cleanup removes the class/style
                setTimeout(() => {
                  // Check for open fullscreen dialog wrapper, not just the dialog element
                  if (document.querySelector('.dkan-fullscreen-data-table-wrapper .ds-c-dialog-wrap.open')) {
                    document.body.classList.add('ds--dialog-open');
                    document.body.style.setProperty('--body_top--dialog-open', '-0px');
                  }
                }, 0);
              }}
              className="dkan-filter-dataset-dialog"
              ariaCloseLabel="Close dialog"
              actions={(
                <div className="ds-u-display--flex ds-u-justify-content--end ds-u-padding-x--2 ds-u-md-padding-x--3 ds-u-padding-y--2">
                  <div className="ds-u-display--flex ">
                    <ClearFiltersButton
                      disabled={queryConditions.length === 0}
                      clearFiltersFn={() => {
                        setConditions([]);
                        updateBrowserURL([]);
                      }}
                      disableDefaultClasses
                      className="ds-l-md-col--auto ds-l-col--auto ds-u-margin--right--0 ds-u-sm-margin-right--2"
                    />
                    <Button
                      disabled={disableFilterSubmitButton()}
                      className="dkan-apply-dataset-filters-button ds-u-float--right ds-l-md-col--auto ds-l-col--auto"
                      onClick={submitConditions}
                      variation="solid"
                    >
                      {`Apply ${conditionsReadyToSubmit(queryConditions).length || ''} filter${conditionsReadyToSubmit(queryConditions).length === 1 ? '' : 's'}`}
                    </Button>
                  </div>
                </div>
              )}
            >
              <div>
                  <p className="ds-u-margin--0 ds-u-margin-top--1 ds-u-margin-bottom--2 ds-u-padding-x--2 ds-u-md-padding-x--3">
                    Add filters to only display data that meets your criteria. Filtered results can be downloaded.
                  </p>

                  <div className="dkan-filter-dataset-controls-header ds-u-padding-x--2 ds-u-md-padding-x--3 ds-u-padding-y--1 ds-u-margin-top--05 ds-u-fill--gray-lightest">
                    <h3 className="ds-u-margin--0 ds-u-font-weight--bold ds-u-padding--0">Column Name</h3>
                    <h3 className="ds-u-margin--0 ds-u-font-weight--bold ds-u-padding--0">Condition</h3>
                    <h3 className="ds-u-margin--0 ds-u-font-weight--bold ds-u-padding--0">Value</h3>
                    <div className="dkan-filter-dataset-controls-header-gutter"></div>
                  </div>

                  <div className="dkan-filter-dataset-form-container ds-u-display--flex ds-u-flex-direction--column ds-u-border-bottom--1">
                    <div className="ds-u-padding-bottom--05">
                      <div className="dkan-filter-dataset-controls">
                        {queryConditions.map((qf, index) => (
                          <FilterItem
                            key={qf.key}
                            id={id}
                            schema={schema}
                            condition={qf}
                            index={index}
                            propertyOptions={propertyOptions}
                            update={updateCondition}
                            remove={removeCondition}
                            className={index !== 0 ? "ds-u-border-top--1" : "ds-u-border--0"}
                          />
                        ))}
                      </div>
                      <div className="ds-u-padding-x--2 ds-u-md-padding-x--3 ds-u-padding-y--1 ds-u-border-top--1 ds-u-margin-top--05">
                        <Button
                          onClick={() => addCondition(null)}
                          className="dkan-add-dataset-filter-button ds-l-col--12 ds-u-radius--pill ds-u-margin-top--05 ds-u-font-weight--normal"
                        >
                          + Add filter
                        </Button>
                      </div>
                    </div>
                  </div>
              </div>
            </Dialog>
          </div>
        </div>
      ) : null}
    </>
  )
}
export default FilterDataset;