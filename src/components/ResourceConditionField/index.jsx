import React from 'react';
import { Button, Dropdown, TextField } from '@cmsgov/design-system';

function buildOperatorOptions(type) {
  switch(type) {
    case 'text':
      return ['LIKE', '=']
    default:
      return []
  }
}

const ResourceConditionField = ({data, index, remove, schema, update}) => {
  const { fields } = schema;
  
  let operatorOptions = []
  const columnOptions = Object.keys(fields).map((key) => { return {label: fields[key].description ? fields[key].description : key, value: key}});
  if(data.property) {
    operatorOptions = buildOperatorOptions(fields[data.property].type).map((opt) => { return {label: opt, value: opt}});
  }
  return(
    <fieldset>
      <div className="ds-u-display--flex">
        <Dropdown
          options={[
            { label: 'Select column', value: '' },
            ...columnOptions
          ]}
          value={data.property}
          onChange={(e) => (update(index, 'property', e.target.value))}
          label="Dropdown example"
          labelClassName="ds-u-margin-top--0"
          name="dropdown_field"
          size="medium"
        />
        <Dropdown
          options={[
            { label: '--', value: '' },
            ...operatorOptions
          ]}
          value={data.operator}
          disabled={!data.property ? true : false}
          onChange={(e) => (update(index, 'operator', e.target.value))}
          labelClassName="ds-u-margin-top--0"
          size="small"
          label="Small size example"
          name="small_dropdown_field"
        />
      </div>
      <div>
        <TextField
          value={data.value}
          disabled={!data.property || !data.operator ? true : false}
          onChange={(e) => (update(index, 'value', e.target.value))}
          label="Single line field"
          labelClassName="ds-u-margin-top--0"
          name="single_example"
        />
        <Button
          className="ds-u-margin-right--1"
          onClick={(e) => {
            e.preventDefault();
            remove(index)
          }}
        >
          <span>Remove filter</span>
        </Button>
      </div>
    </fieldset>
  );
};

export default ResourceConditionField;
