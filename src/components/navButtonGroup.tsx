import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';

import { Icon } from '../components';

interface IProps {
  className?: string;
  color: string;
  'button-color': string;
  disabled?: [boolean, boolean];
  'disabled-right'?: boolean;
  'on-click': [
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  ];
  label: string;
}

const NavButtonGroup = ({
  className,
  color,
  'button-color': colorButton,
  disabled,
  'on-click': onClick,
  label,
}: IProps) => {
  const disabledLeft = disabled ? disabled[0] : false;
  const disabledRight = disabled ? disabled[1] : false;

  const classNames = `d-flex mb-3 ${className}`.trim();

  return (
    <ButtonGroup color={color} className={classNames}>
      <Button color={colorButton} onClick={onClick[0]} disabled={disabledLeft}>
        <Icon icon="backward" />
      </Button>
      <Button color={colorButton} disabled={true} block>
        {label}
      </Button>
      <Button color={colorButton} onClick={onClick[1]} disabled={disabledRight}>
        <Icon icon="forward" />
      </Button>
    </ButtonGroup>
  );
};

export default NavButtonGroup;
