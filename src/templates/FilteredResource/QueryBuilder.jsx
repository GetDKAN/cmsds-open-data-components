import React, { useState } from 'react';
import qs from 'qs';
import { AccordionItem, Button, Dropdown, TextField } from '@cmsgov/design-system';
import QueryRow from './QueryRow';
import QueryTitle from './QueryTitle';
import { buildOperatorOptions } from './functions';
import "./query-builder.scss";

function updateQueryForDatastore(condition) {
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

const QueryBuilder = ({ resource, id, includeSearchParams, customColumns }) => {
  const { conditions, schema, setConditions } = resource;
  const fields = Object.keys(schema[id].fields);

  const [queryConditions, setQueryConditions] = useState([]);
  const [titleConditions, setTitleConditions] = useState([]); // Add use effect to load conditions on first load if needed
  const [conditionsChanged, setConditionsChanged] = useState(false);

  const addCondition = (condition) => {
    if (Array.isArray(condition)) {
      const keyedConditions = condition.map((oc) => ({
        ...oc,
        key: Date.now() + oc.value + oc.property,
      }));
      setQueryConditions(keyedConditions);
    } else {
      setQueryConditions([
        ...queryConditions,
        {
          property: fields[0],
          value: '',
          operator: buildOperatorOptions(schema[id].fields[fields[0]].mysql_type)[0].value,
          key: Date.now(),
        },
      ]);
    }
  };

  React.useEffect(() => {
    addCondition(conditions);
    setTitleConditions(conditions);
  }, []);

  const propertyOptions = fields.map((f) => {
    if (schema[id].fields[f].description) {
      return { label: schema[id].fields[f].description, value: f };
    }
    return { label: f, value: f };
  });

  const submitConditions = (e) => {
    e.preventDefault();
    const submitConditions = queryConditions
      .filter((oc) => {
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
    setTitleConditions(queryConditions.map((oc) => Object.assign({}, oc)));
    setConditionsChanged(false);
    if (includeSearchParams) {
      const url = new URL(window.location);
      const urlString = qs.stringify(
        { conditions: submitConditions },
        { encodeValuesOnly: true, addQueryPrefix: true }
      );
      window.history.pushState({}, '', `${url.origin}${url.pathname}${urlString}`);
    }
  };

  const updateCondition = (index, key, value) => {
    let newConditions = [...queryConditions];
    newConditions[index][key] = value;
    setQueryConditions(newConditions);
    setConditionsChanged(true);
  };

  const removeCondition = (index) => {
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
          defaultOpen={false}
        >
          <form onSubmit={(e) => submitConditions(e)}>
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

            <div className="dc-query-bulder--form-buttons ds-u-padding-y--2">
              <Button variation="transparent" onClick={() => addCondition(null)}>
                + Add filter
              </Button>
              <Button disabled={!conditionsChanged} className="ds-u-float--right" type="submit">
                Apply filters
              </Button>
            </div>
          </form>
        </AccordionItem>
      </div>
    </div>
  );
};

QueryBuilder.defaultProps = {
  includeSearchParams: true,
};

export default QueryBuilder;
