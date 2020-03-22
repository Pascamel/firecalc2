import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';

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
        <FontAwesomeIcon icon="backward" />
      </Button>
      <Button color="outline-secondary" disabled={true} block>
        {year === 0 ? 'All' : year}
      </Button>
      <Button
        color="outline-secondary"
        onClick={onNextYearClick}
        disabled={year === new Date().getFullYear()}
      >
        <FontAwesomeIcon icon="forward" />
      </Button>
    </ButtonGroup>
  );
};

export default YearSelectorMobile;
