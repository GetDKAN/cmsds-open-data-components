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
  const [titleConditions, setTitleConditions] = useState<Array<ConditionType>>([]); // Add use effect to load conditions on first load if needed
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

  const submitConditions = (e: Event) => {
    // only update the data conditions when "Apply filters" is pressed
    e.preventDefault();
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
    setConditions(submitConditions);
    setPage(1);
    setOffset(0);
    setConditionsChanged(false);
    updateBrowserURL(submitConditions);
  };

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
  };

  return (
    <>
      {(Object.keys(resource).length && columns.length && resource.schema && Object.keys(distribution).length) ? (
        <div className="filter-dataset-wrapper">
          <button
            aria-label="Filter Dataset - Opens in a dialog"
            className="ds-c-button ds-c-button--ghost ds-u-margin-y--1"
            onClick={() => {
              setModalOpen(true)
            }}
          >
            <i className="far fa-filter ds-u-margin-right--1"></i>Filter Dataset
          </button>
          <div className={`ds-c-dialog-wrap${modalOpen ? ' open' : ''}`}>
            <Dialog
              heading="Filter Dataset"
              isOpen={modalOpen}
              onExit={() => setModalOpen(false)}
              className="dkan-filter-dataset-dialog"
              ariaCloseLabel="Close filter dataset dialog"
              actions={(
                <div className="ds-u-display--flex ds-u-justify-content--end ds-u-padding-x--3 ds-u-padding-y--2">
                  <div className="ds-u-display--flex ">
                    <ClearFiltersButton
                      disabled={queryConditions.length === 0}
                      clearFiltersFn={() => {
                        setConditions([]);
                        updateBrowserURL([]);
                      }}
                      disableDefaultClasses
                      classNames="ds-l-md-col--auto ds-l-col--auto ds-u-margin--right--0 ds-u-sm-margin-right--2"
                    />
                    <Button
                      disabled={!conditionsChanged}
                      className="ds-u-float--right ds-l-md-col--auto ds-l-col--auto"
                      type="submit"
                      variation="solid"
                    >
                      Apply filters
                    </Button>
                  </div>
                </div>
              )}
            >
              <div>
                  <p className="ds-u-margin--0 ds-u-padding-x--3">
                    Add filters to only display data that meets your criteria. Filtered results can be downloaded.
                  </p>
                  
                  <div className="ds-u-display--none ds-u-md-display--flex ds-u-fill--gray-lightest ds-u-border-top--1 ds-u-border-bottom--1 ds-u-padding-x--3 ds-u-margin-top--3">
                    <div className="ds-l-col--12 ds-l-md-col--8 ds-u-display--flex ds-u-padding-x--0">
                      <div className="ds-l-col--8 ds-u-padding-left--0">
                        <h3 className="ds-u-margin--0 ds-u-font-weight--bold ds-u-padding-y--1">Column Name</h3>
                      </div>
                      <div className="ds-l-col--4 ds-u-padding-x--0">
                        <h3 className="ds-u-margin--0 ds-u-font-weight--bold ds-u-padding-y--1">Operator</h3>
                      </div>
                    </div>
                    <div className="ds-l-col--12 ds-l-md-col--4 ds-u-padding-x--0 ds-u-md-padding-left--2">
                      <h3 className="ds-u-margin--0 ds-u-font-weight--bold ds-u-padding-y--1">Value</h3>
                    </div>
                  </div>

                  <div className="ds-u-md-display--none ds-u-display--block ds-u-border-bottom--1 ds-u-padding-top--1"></div>

                  <div className="dkan-filter-dataset-form-container ds-u-display--flex ds-u-flex-direction--column ds-u-border-bottom--1">
                    <form onSubmit={(e) => submitConditions(e as any)}>
                      <div className="ds-u-padding-bottom--05">
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
                            classNames={index !== 0 ? "ds-u-border-top--1" : "ds-u-border--0"}
                          />
                        ))}
                        <div className="ds-u-padding-x--3 ds-u-padding-y--1 ds-u-border-top--1 ds-u-margin-top--05">
                          <Button
                            onClick={() => addCondition(null)}
                            className="ds-l-col--12 ds-u-radius--pill ds-u-margin-top--05"
                          >
                            + Add filter
                          </Button>
                        </div>
                      </div>
                    </form>
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