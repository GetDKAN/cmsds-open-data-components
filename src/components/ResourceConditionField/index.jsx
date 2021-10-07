import React from 'react';
import { Button, Dropdown, TextField } from '@cmsgov/design-system';
import CloseIcon from '../../assets/icons/close';

function buildOperatorOptions(type) {
  switch(type) {
    case 'text': // Will change from text to string in future update
    case 'string':
      return [
        {label: "Is", value: "="},
        {label: "Contains", value: "like"},
        {label: "Is Not", value: "<>"},
        {label: "Or", value: "in"}
      ]
    case 'date':
      return []
    default: // These 2 should be safe for all data types
      return [
        {label: "Is", value: "="},
        {label: "Is Not", value: "<>"},
      ]
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
  const { fields } = schema;
  const [propertyOptions, setPropertyOptions] = React.useState(Object.keys(fields).map((key) => { return {label: fields[key].description ? fields[key].description : key, value: key}}))
  const [property, setProperty] = React.useState(data.property);
  const [operator, setOperator] = React.useState(data.operator);
  const [operatorOptions, setOperatorOptions] = React.useState([{ label: '--', value: '' },]);
  const [value, setValue] = React.useState(data.value);

  React.useEffect(() => {
    if(property) {
      const opOptions = buildOperatorOptions(fields[property].type).map((opt) => { return {label: opt.label, value: opt.value}});
      update(index, 'property', property);
      if(!operator) {
        setOperator(opOptions[0].value);
      }
      setOperatorOptions(opOptions);
    } else {
      update(index, 'property', property);
      setOperator('');
      setValue('')
      setOperatorOptions([{ label: '--', value: '' },]);
    }
  }, [property, operator]);

  React.useEffect(() => {
    if(operator) {
      update(index, 'operator', operator);
    } else {
      update(index, 'operator', '');
    }
  }, [operator]);

  React.useEffect(() => {
    if(value) {
      update(index, 'value', value);
    } else {
      update(index, 'value', '');
    }
  }, [value]);

  return(
    <fieldset>
      <div className="ds-l-form-row">
        <Dropdown
          options={[
            { label: 'Select column', value: '' },
            ...propertyOptions
          ]}
          value={property}
          onChange={(e) => setProperty(e.target.value)}
          label='Filter column'
          labelClassName="ds-u-margin-top--0 ds-u-visibility--screen-reader"
          name={`column_name_${index}`}
          className="ds-l-col--6"
        />
        <Dropdown
          options={[
            ...operatorOptions
          ]}
          value={operator}
          disabled={!property ? true : false}
          onChange={(e) => setOperator(e.target.value)}
          labelClassName="ds-u-margin-top--0 ds-u-visibility--screen-reader"
          size="small"
          label="Filter operator"
          name={`filter_operator_${index}`}
          className="ds-l-col--3"
        />
      </div>
      <div className="ds-l-form-row">
        <TextField
          hint={operator.toLowerCase() === 'in' ? `Separate values with a comma.` : ''}
          value={cleanText(value, operator)}
          disabled={!property ? true : false}
          onChange={(e) => setValue(e.target.value)}
          label="Filter value"
          labelClassName="ds-u-margin-top--0"
          name={`filter_value_${index}`}
          className="ds-l-col--11"
        />
        <Button
          className="ds-l-col--1"
          variation="transparent"
          aria-label="Remove filter"
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
