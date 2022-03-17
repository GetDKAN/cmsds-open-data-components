import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Accordion, AccordionItem, Button, Dropdown, TextField } from '@cmsgov/design-system';
import { buildOperatorOptions, convertUTCToLocalDate } from './functions';
import 'react-datepicker/dist/react-datepicker.css';

function getStartDate(condition, schema, id) {
  if (schema[id].fields[condition.property].mysql_type === 'date') {
    const newDate = new Date(condition.value);
    if (newDate instanceof Date && !isNaN(newDate)) {
      return newDate;
    }
  }
  return new Date();
}

const QueryRow = ({ id, condition, index, update, remove, propertyOptions, schema }) => {
  const [operator, setOperator] = useState(condition.operator);
  const [property, setProperty] = useState(condition.property);
  const [value, setValue] = useState(condition.value);
  const [startDate, setStartDate] = React.useState(getStartDate(condition, schema, id));
  useEffect(() => {
    if (property !== condition.property) {
      if (property) {
        update(index, 'property', property);
      } else {
        update(index, 'property', '');
      }
    }
  }, [property]);

  useEffect(() => {
    if (operator !== condition.operator) {
      if (operator) {
        update(index, 'operator', operator);
      } else {
        update(index, 'operator', '');
      }
    }
  }, [operator]);

  useEffect(() => {
    if (value !== condition.value) {
      if (value) {
        update(index, 'value', value);
      } else {
        update(index, 'value', '');
      }
    }
  }, [value]);

  return (
    <fieldset className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center">
      <Dropdown
        options={propertyOptions}
        value={property}
        label="Property"
        name={'something'}
        onChange={(e) => setProperty(e.target.value)}
      />
      <Dropdown
        options={buildOperatorOptions(schema[id].fields[property].mysql_type)}
        value={operator}
        label="Operator"
        name={'something_operatior'}
        onChange={(e) => setOperator(e.target.value)}
      />
      {schema[id].fields[property].mysql_type === 'date' ? (
        <div>
          <label class="ds-c-label" for="field_10" id="field_10-label">
            <span class="">Property</span>
          </label>
          <DatePicker
            selected={convertUTCToLocalDate(startDate)}
            onChange={(date) => {
              setStartDate(date);
              setValue(date.toJSON().slice(0, 10));
            }}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className="ds-c-field"
            popperPlacement="top-end"
            popperModifiers={[
              // {
              //   name: 'offset',
              //   options: {
              //     offset: [5, 10],
              //   },
              // },
              {
                name: 'preventOverflow',
                options: {
                  rootBoundary: 'viewport',
                  // tether: true,
                  altAxis: true,
                },
              },
            ]}
          />
        </div>
      ) : (
        <TextField
          label="Value"
          name="value_something"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      )}

      <Button size="small" className="ds-u-margin-top--3" onClick={() => remove(index)}>
        Delete filter
      </Button>
    </fieldset>
  );
};

export default QueryRow;
