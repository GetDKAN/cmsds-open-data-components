import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Button, Dropdown, TextField } from '@cmsgov/design-system';
import { buildOperatorOptions, convertUTCToLocalDate, cleanText } from '../../templates/FilteredResource/functions';
import 'react-datepicker/dist/react-datepicker.css';
import { QueryRowType, ConditionType } from '../../types/dataset';

function getStartDate(condition : ConditionType, schema : any, id : string) {
  if (schema[id].fields[condition.property].mysql_type === 'date') {
    const newDate = new Date(condition.value.toString());
    if (newDate instanceof Date && !isNaN(newDate.getTime())) {
      return newDate;
    }
  }
  return new Date();
}

const QueryRow = ({ id, condition, index, update, remove, propertyOptions, schema } : QueryRowType) => {
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
      if (schema[id].fields[condition.property].mysql_type === 'date') {
        if (!value) {
          setValue(startDate.toJSON().slice(0, 10));
        }
      }
    }
  }, [property, value, startDate, schema, id, condition]);

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
    <fieldset className="ds-u-display--flex ds-u-flex-wrap--wrap ds-u-justify-content--between ds-u-align-items--center ds-u-border--0">
      <div className="ds-l-col--12 ds-l-md-col--8 ds-u-display--flex ds-u-justify-content--between ds-u-padding-x--0">
        <Dropdown
          options={propertyOptions}
          className="ds-l-col--8 ds-u-padding-left--0"
          value={property}
          label="Column Name"
          name={`${condition.key}_property`}
          onChange={(e) => setProperty(e.target.value)}
          autoFocus
        />
        <Dropdown
          options={buildOperatorOptions(schema[id].fields[property].mysql_type)}
          className="ds-l-col--4 ds-u-padding-x--0"
          value={operator}
          label="Operator"
          name={`${condition.key}_operator`}
          onChange={(e) => setOperator(e.target.value)}
        />
      </div>
      <div className="ds-l-col--12 ds-l-md-col--4 ds-u-padding-x--0 ds-u-md-padding-left--2 ds-u-display--flex ds-u-justify-content--between">
        {schema[id].fields[property].mysql_type === 'date' ? (
          <div>
            <label
              className="ds-c-label"
              htmlFor={`${condition.key}_date_value`}
              id={`${condition.key}_date_value-label`}
            >
              <span>Value</span>
            </label>
            <DatePicker
              name={`${condition.key}_date_value`}
              selected={convertUTCToLocalDate(startDate)}
              onChange={(date : Date) => {
                setStartDate(date);
                setValue(date.toJSON().slice(0, 10));
              }}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              className="ds-c-field"
              withPortal
            />
          </div>
        ) : (
          <TextField
            className="ds-l-col--11 ds-u-padding-x--0"
            label="Value"
            name={`${condition.key}_value`}
            value={cleanText(value, operator)}
            onChange={(e) => setValue(e.target.value)}
          />
        )}

        <Button
          variation="ghost"
          size="small"
          className="ds-u-margin-top--3 ds-u-padding-right--0"
          aria-label="Delete filter"
          onClick={() => remove(index)}
        >
          <span className="fas fa-trash"></span>
        </Button>
      </div>
    </fieldset>
  );
};

export default QueryRow;