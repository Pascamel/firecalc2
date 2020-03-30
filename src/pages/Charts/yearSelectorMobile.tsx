import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';

import { Icon } from '../../components';

interface IProps {
  year: number;
  onPrevYearClick: () => void;
  onNextYearClick: () => void;
}

const YearSelectorMobile = (props: IProps) => {
  const { year, onPrevYearClick, onNextYearClick } = props;

  return (
    <ButtonGroup style={{ width: '100%' }} color="light" className="mb-3">
      <Button
        color="outline-secondary"
        onClick={onPrevYearClick}
        disabled={year === 0}
      >
        <Icon icon="backward" />
      </Button>
      <Button color="outline-secondary" disabled={true} block>
        {year === 0 ? 'All' : year}
      </Button>
      <Button
        color="outline-secondary"
        onClick={onNextYearClick}
        disabled={year === new Date().getFullYear()}
      >
        <Icon icon="forward" />
      </Button>
    </ButtonGroup>
  );
};

export default YearSelectorMobile;
