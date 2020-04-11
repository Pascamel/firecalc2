import _ from 'lodash';
import React from 'react';
import { CustomInput, InputGroup, InputGroupAddon } from 'reactstrap';

import { labelMonth } from '../helpers';

interface IProps {
  disabled?: boolean;
  inputId: string;
  month: number;
  setMonth: (v: number) => void;
  'month-range': [number, number];
  year: number;
  setYear: (v: number) => void;
  'year-range': [number, number];
}

const MonthYearPicker = ({
  disabled,
  inputId,
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
        id={`month-${inputId}`}
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
          id={`year-${inputId}`}
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
