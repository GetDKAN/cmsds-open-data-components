import React from 'react';
import { Badge, FilterChip } from '@cmsgov/design-system';
import { operatorMapping, cleanText } from './functions';

const QueryTitle = ({ conditions, schema, customColumns }) => {
  const { fields } = schema;
  if (!conditions.length) {
    return <>Add a filter</>;
  }

  function formatValue(text, property) {
    if (customColumns.length > 0) {
      let newValue = text;
      let customColumn = customColumns.find((c) => c.accessor === property);
      if (customColumn && customColumn.cell) {
        return customColumn.cell({ value: text });
      }
      return text;
    } else {
      return text;
    }
  }

  return (
    <span className="dc-querybuilder-title">
      {conditions
        .map((c) => {
          const field = fields[c.property];
          const description = field && field.description ? field.description : c.property;
          const operator = operatorMapping.find((op) => op.value === c.operator);
          const cleanedText = cleanText(c.value);
          const formattedText = formatValue(cleanedText, c.property);
          return (
            <span className="ds-u-fill--background ds-u-padding--1 ds-u-margin-y--1 ds-u-display--inline-block ds-u-font-weight--semibold">
              <span className="ds-u-font-weight--bold">{description}</span>{' '}
              <span className="ds-u-font-weight--normal">{operator.label.toUpperCase()}</span>{' '}
              <span className="ds-u-color--success">{formattedText}</span>
            </span>
          );
        })
        .reduce((prev, curr) => [
          prev,
          <Badge className="ds-u-margin-x--1" variation="info">
            AND
          </Badge>,
          curr,
        ])}
    </span>
  );
};

export default QueryTitle;
