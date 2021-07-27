import React from 'react';
import { Button, Dropdown, TextField } from '@cmsgov/design-system';
import CloseIcon from '../../assets/icons/close';

function buildOperatorOptions(type) {
  switch(type) {
    case 'text':
      return [
        {label: "Is", value: "="},
        {label: "Contains", value: "like"},
        {label: "Is Not", value: "<>"},
        {label: "Or", value: "in"}
      ]
    default:
      return []
  }
}

function cleanText(value, operator) {
  let newValue = value.replace(/(^\%+|\%+$)/mg, '');
  if(operator.toLowerCase() === 'in') {
    if(Array.isArray(newValue)) {
      newValue = newValue.join(',')
    }
  }
  return newValue;
}

const ResourceConditionField = ({data, index, remove, schema, update}) => {
  const { fields } = schema;
  
  let operatorOptions = []
  const columnOptions = Object.keys(fields).map((key) => { return {label: fields[key].description ? fields[key].description : key, value: key}});
  if(data.property) {
    operatorOptions = buildOperatorOptions(fields[data.property].type).map((opt) => { return {label: opt.label, value: opt.value}});
  }
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
