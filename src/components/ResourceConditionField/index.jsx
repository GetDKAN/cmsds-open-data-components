import React from 'react';
import { Button, Dropdown, TextField } from '@cmsgov/design-system';
import DatePicker from "react-datepicker";
import CloseIcon from '../../assets/icons/close';
import "react-datepicker/dist/react-datepicker.css";

function convertUTCToLocalDate(date) {
  if (!date) {
    return date
  }
  date = new Date(date)
  date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  return date
}

function buildOperatorOptions(type) {
  switch(type) {
    case 'text':
      return [
        {label: "Is", value: "="},
        {label: "Contains", value: "like"},
        {label: "Is Not", value: "<>"},
        {label: "Or", value: "in"},
        
      ]
    case 'date':
      return [
        {label: "Is", value: "="},
        {label: "Is Not", value: "<>"},
        {label: "Greater Than", value: ">"},
        {label: "Less Than", value: "<"},
      ]
    default:
      return []
  }
}

function cleanText(value, operator) {
  let newValue = value;
  if(Array.isArray(newValue)) {
    newValue = newValue.join(',')
  }
  return newValue.replace(/(^\%+|\%+$)/mg, '');
}

const ResourceConditionField = ({data, index, remove, schema, update}) => {
  let myDate = new Date(data.value)
  console.log(myDate)
  myDate = new Date(Date.UTC(myDate.getFullYear(), myDate.getMonth(), myDate.getDate()))
  const [startDate, setStartDate] = React.useState(data.value ? new Date(data.value) : new Date(Date.now()));
  console.log(myDate, startDate, typeof myDate.getMonth === 'function')
  const { fields } = schema;
  let operatorOptions = []
  const columnOptions = Object.keys(fields).map((key) => { return {label: fields[key].description ? fields[key].description : key, value: key}});
  if(data.property) {
    operatorOptions = buildOperatorOptions(fields[data.property].mysql_type).map((opt) => { return {label: opt.label, value: opt.value}});
  }
  console.log(fields)
  console.log(data)
  return(
    <fieldset>
      <div className="ds-l-form-row">
        <Dropdown
          options={[
            { label: 'Select column', value: '' },
            ...columnOptions
          ]}
          value={data.property}
          onChange={(e) => (update(index, 'property', e.target.value))}
          label='Filter column'
          labelClassName="ds-u-margin-top--0 ds-u-visibility--screen-reader"
          name={`column_name_${index}`}
          className="ds-l-col--6"
        />
        <Dropdown
          options={[
            { label: '--', value: '' },
            ...operatorOptions
          ]}
          value={data.operator}
          disabled={!data.property ? true : false}
          onChange={(e) => (update(index, 'operator', e.target.value))}
          labelClassName="ds-u-margin-top--0 ds-u-visibility--screen-reader"
          size="small"
          label="Filter Operator"
          name={`filter_operator_${index}`}
          className="ds-l-col--3"
        />
      </div>
      <div className="ds-l-form-row">
        
        {data.property && fields[data.property].mysql_type.toLowerCase() === 'date'
          ? (
            <div className="ds-u-clearfix ds-l-col--11">
              <DatePicker
                selected={convertUTCToLocalDate(startDate)}
                onChange={(date) => {setStartDate(date); update(index, 'value', date.toJSON().slice(0, 10))}}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="ds-c-field"
                
              />
            </div>
            )
          : (
            <TextField
              hint={data.operator.toLowerCase() === 'in' ? `Separate values with a comma.` : ''}
              value={cleanText(data.value, data.operator)}
              disabled={!data.property || !data.operator ? true : false}
              onChange={(e) => (update(index, 'value', e.target.value))}
              label="Filter value"
              labelClassName="ds-u-margin-top--0"
              name={`filter_value_${index}`}
              className="ds-l-col--11"
            />
          )
        }
        <Button
          className="ds-l-col--1"
          variation="transparent"
          onClick={(e) => {
            e.preventDefault();
            remove(index)
          }}
        >
          <CloseIcon />
        </Button>
      </div>
      
    </fieldset>
  );
};

export default ResourceConditionField;
