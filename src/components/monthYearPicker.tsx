import _ from 'lodash';
import React from 'react';
import { CustomInput, InputGroup, InputGroupAddon } from 'reactstrap';

import { labelMonth } from '../helpers';

interface IProps {
  disabled?: boolean;
  month: number;
  setMonth: (v: number) => void;
  'month-range': [number, number];
  year: number;
  setYear: (v: number) => void;
  'year-range': [number, number];
}

const MonthYearPicker = ({
  disabled,
  month,
  setMonth,
  'month-range': monthRange,
  year,
  setYear,
  'year-range': yearRange
}: IProps) => {
  return (
    <InputGroup>
      <CustomInput
        type="select"
        value={month || 0}
        onChange={e => setMonth(parseInt(e.target.value))}
        disabled={disabled}
      >
        {_.range(...monthRange).map((m, key) => (
          <option value={m} key={key}>
            {labelMonth(m.toString())}
          </option>
        ))}
      </CustomInput>
      <InputGroupAddon addonType="append">
        <CustomInput
          type="select"
          value={year || 0}
          onChange={e => setYear(parseInt(e.target.value))}
          disabled={disabled}
        >
          {_.range(...yearRange).map((y, key) => (
            <option value={y} key={key}>
              {y}
            </option>
          ))}
        </CustomInput>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default MonthYearPicker;
