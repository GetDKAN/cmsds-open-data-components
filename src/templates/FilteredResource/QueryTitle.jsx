import React from 'react';
import { Badge, FilterChip } from '@cmsgov/design-system';
import { operatorMapping, cleanText } from './functions';

const QueryTitle = ({ conditions, schema }) => {
  const { fields } = schema;
  if (!conditions.length) {
    return 'Add a filter';
  }

  function buildTitle() {
    const newTitle = conditions.map((c) => {
      const field = fields[c.property];
      const description = field && field.description ? field.description : c.property;
      const operator = operatorMapping.find((op) => op.value === c.operator);
      return `${description} ${operator.label} ${cleanText(c.value)}`;
    });
    return newTitle.join(' AND ');
  }

  return (
    <>
      {conditions
        .map((c) => {
          const field = fields[c.property];
          const description = field && field.description ? field.description : c.property;
          const operator = operatorMapping.find((op) => op.value === c.operator);
          return (
            <span className="ds-u-fill--background ds-u-padding--1 ds-u-margin-y--1 ds-u-display--inline-block ds-u-font-weight--semibold">
              <span className="ds-u-font-weight--bold">{description}</span>{' '}
              <span className="ds-u-font-weight--normal">{operator.label.toUpperCase()}</span>{' '}
              <span className="ds-u-color--success">{cleanText(c.value)}</span>
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
    </>
  );
};

export default QueryTitle;
