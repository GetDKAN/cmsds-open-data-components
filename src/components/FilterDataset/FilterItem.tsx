import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useMediaQuery } from 'react-responsive';
import { Button, Dropdown, TextField } from '@cmsgov/design-system';
import { buildOperatorOptions, convertUTCToLocalDate, cleanText } from '../../templates/FilteredResource/functions';
import 'react-datepicker/dist/react-datepicker.css';
import { FilterItemType, ConditionType } from '../../types/dataset';

import './FilterItem.scss';

function getStartDate(condition : ConditionType, schema : any, id : string) {
  if (schema[id].fields[condition.property].mysql_type === 'date') {
    const newDate = new Date(condition.value.toString());
    if (newDate instanceof Date && !isNaN(newDate.getTime())) {
      return newDate;
    }
  }
  return new Date();
}

const FilterItem = ({ id, condition, index, update, remove, propertyOptions, schema, className = '' } : FilterItemType) => {
  const [operator, setOperator] = useState(condition.operator);
  const [property, setProperty] = useState(condition.property);
  const [value, setValue] = useState(condition.value);
  const [startDate, setStartDate] = React.useState(getStartDate(condition, schema, id));

  const xl = useMediaQuery({minWidth: 1280})

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
    <fieldset className={`dkan-filter-dataset-control ds-u-padding-x--2 ds-u-md-padding-x--3 ds-u-padding-y--1 ds-u-margin-top--05${className !== '' ? ` ${className}` : ''}`}>
      <Dropdown
        options={propertyOptions}
        className="ds-u-padding-x--0"
        value={property}
        label="Column Name"
        name={`${condition.key}_property`}
        onChange={(e) => setProperty(e.target.value)}
      />
      <Dropdown
        options={buildOperatorOptions(schema[id].fields[property].mysql_type)}
        className="ds-u-padding-x--0"
        value={operator}
        label="Operator"
        name={`${condition.key}_operator`}
        onChange={(e) => setOperator(e.target.value)}
      />
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
          className="ds-u-padding-x--0"
          label="Value"
          name={`${condition.key}_value`}
          value={cleanText(value, operator)}
          onChange={(e) => setValue(e.target.value)}
          placeholder='Enter value'
        />
      )}

      <Button
        variation="ghost"
        size="small"
        className="dkan-delete-dataset-filter-button ds-u-padding-x--0 ds-u-margin-left--05 ds-u-md-margin-top--0 ds-u-border--1 ds-u-border--dark ds-u-color--black"
        aria-label="Delete filter"
        onClick={() => remove(index)}
      >
        <span className="far fa-trash"></span>
      </Button>
    </fieldset>
  );
};

export default FilterItem;