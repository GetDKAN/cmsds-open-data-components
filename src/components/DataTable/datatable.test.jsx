import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { axe, toHaveNoViolations } from 'jest-axe';
import DataTable from './index';

expect.extend(toHaveNoViolations);

describe('<DataTable />', () => {

})