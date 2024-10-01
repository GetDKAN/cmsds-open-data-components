import React, { useState } from 'react';
import qs from 'qs';
import { AccordionItem, Button } from '@cmsgov/design-system';
import { buildOperatorOptions } from '../../templates/FilteredResource/functions';
import QueryTitle from '../../templates/FilteredResource/QueryTitle';
import QueryRow from '../QueryRow';
import { ConditionType, SchemaType } from '../../types/dataset';
import ClearFiltersButton from './ClearFiltersButton';

type QueryBuilderPropTypes = {
  resource: {
    conditions: Array<ConditionType>;
    schema: SchemaType;
    setConditions: Function;
  };
  id: string;
  customColumns: Array<Object>;
  isModal?: boolean;
  setPage: Function;
  setOffset: Function;
};

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

const QueryBuilder = ({resource, id, customColumns, isModal = false, setPage, setOffset}: QueryBuilderPropTypes) => {
  const { conditions, schema, setConditions } = resource;

  const fields = Object.keys(schema[id].fields);

  const [queryConditions, setQueryConditions] = useState<Array<ConditionType>>([]);
  const [titleConditions, setTitleConditions] = useState<Array<ConditionType>>([]); // Add use effect to load conditions on first load if needed
  const [conditionsChanged, setConditionsChanged] = useState(false);

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
  React.useEffect(() => {
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
    <div className="dc-query-builder ds-u-margin-bottom--3">
      <div className="ds-c-accordion ds-c-accordion--bordered">
        <AccordionItem
          heading={
            <QueryTitle
              schema={schema[id]}
              conditions={titleConditions}
              customColumns={customColumns}
            />
          }
          defaultOpen={!isModal}
        >
          <form onSubmit={(e) => submitConditions(e as any)}>
            <div>
              {queryConditions.map((qf, index) => (
                <QueryRow
                  key={qf.key}
                  id={id}
                  schema={schema}
                  condition={qf}
                  index={index}
                  propertyOptions={propertyOptions}
                  update={updateCondition}
                  remove={removeCondition}
                />
              ))}
            </div>

            <div className="dc-query-bulder--form-buttons ds-u-padding-x--2 ds-u-padding-top--0 ds-u-md-padding-top--2 ds-u-display--flex ds-u-flex-wrap--wrap">
              <div className="ds-l-col--12 ds-l-md-col--4 ds-l-md-col--6 ds-u-padding-x--0 ds-u-margin-bottom--2 ds-u-md-margin-bottom--0">
                <Button
                  variation="ghost"
                  onClick={() => addCondition(null)}
                  className="ds-u-padding-left--0"
                >
                  + Add filter
                </Button>
              </div>
              <div className="ds-u-display--flex ds-u-justify-content--end ds-l-col--12 ds-l-md-col--6 ds-u-padding-x--0">
                <Button
                  disabled={!conditionsChanged}
                  className="ds-u-float--right ds-l-md-col--6 ds-u-margin--right--0 ds-u-sm-margin-right--2"
                  type="submit"
                  variation="solid"
                >
                  Apply filters
                </Button>
                <ClearFiltersButton
                  disabled={queryConditions.length === 0}
                  clearFiltersFn={() => {
                    setConditions([]);
                    updateBrowserURL([]);
                  }} />
              </div>
            </div>
          </form>
        </AccordionItem>
        </div>
    </div>
  );
};

export default QueryBuilder;