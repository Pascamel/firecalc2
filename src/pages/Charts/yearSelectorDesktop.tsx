import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

interface IProps {
  year: number;
  years: number[];
  onSelect: (years: number) => void;
}

const YearSelectorDesktop = ({ year, years, onSelect }: IProps) => (
  <ListGroup>
    {years.map(y => (
      <ListGroupItem
        key={y}
        className="text-left cursor"
        color={y === year ? 'primary' : 'darker'}
        onClick={() => onSelect(y)}
      >
        {y === 0 ? 'All' : y}
      </ListGroupItem>
    ))}
  </ListGroup>
);

export default YearSelectorDesktop;
