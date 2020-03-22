import React from 'react';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';

interface IProps {
  year: number;
  years: number[];
  onSelect: (years: number) => void;
}

const YearSelectorDesktop = (props: IProps) => {
  const { year, years, onSelect } = props;

  return (
    <ListGroup>
      {years.map(y => (
        <ListGroupItem
          key={y}
          className="text-left"
          color={y === year ? 'secondary' : 'link'}
          tag={Button}
          onClick={() => onSelect(y)}
        >
          {y === 0 ? 'All' : y}
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};

export default YearSelectorDesktop;
