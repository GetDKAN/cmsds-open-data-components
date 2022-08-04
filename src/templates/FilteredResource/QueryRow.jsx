import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useMediaQuery } from 'react-responsive';
import { Accordion, AccordionItem, Button, Dropdown, TextField } from '@cmsgov/design-system';
import { buildOperatorOptions, convertUTCToLocalDate, cleanText } from './functions';
import 'react-datepicker/dist/react-datepicker.css';
import CloseIcon from '../../assets/icons/close';

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
  const md = useMediaQuery({ minWidth: 0, maxWidth: 768 });
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
        if(!value) {
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
    <fieldset className="ds-u-display--flex ds-u-justify-content--between ds-u-align-items--center">
      <Dropdown
        options={propertyOptions}
        value={property}
        label="Property"
        name={`${condition.key}_property`}
        onChange={(e) => setProperty(e.target.value)}
      />
      <Dropdown
        options={buildOperatorOptions(schema[id].fields[property].mysql_type)}
        value={operator}
        size="small"
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
            onChange={(date) => {
              setStartDate(date);
              setValue(date.toJSON().slice(0, 10));
            }}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className="ds-c-field"
            withPortal
            // popperPlacement="top-end"
            // popperModifiers={[
            //   {
            //     name: 'preventOverflow',
            //     options: {
            //       rootBoundary: 'viewport',
            //       // tether: true,
            //       altAxis: true,
            //     },
            //   },
            // ]}
          />
        </div>
      ) : (
        <TextField
          label="Value"
          name={`${condition.key}_value`}
          value={cleanText(value, operator)}
          onChange={(e) => setValue(e.target.value)}
        />
      )}

      <Button
        variation={md ? 'transparent' : null}
        size="small"
        className="ds-u-margin-top--3"
        aria-label="Delete filter"
        onClick={() => remove(index)}
      >
        {!md ? (
          <>Delete filter</>
        ) : (
          <>
            <CloseIcon />{' '}
          </>
        )}
      </Button>
    </fieldset>
  );
};

export default QueryRow;
