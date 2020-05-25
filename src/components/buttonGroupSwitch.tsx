import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';

interface IProps {
  className?: string;
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  colors: Array<string>;
  values: Array<boolean>;
  disabled?: boolean;
  nodes: Array<string>;
}

const ButtonGroupSwitch = ({
  className,
  setValue,
  colors,
  value,
  values,
  disabled,
  nodes,
}: IProps) => {
  value = value ?? false;

  return (
    <ButtonGroup className={className}>
      <Button
        color={value === values[0] ? colors[0] : colors[1]}
        onClick={() => {
          setValue(values[0]);
        }}
        disabled={disabled}
      >
        {nodes[0]}
      </Button>
      <Button
        color={value === values[1] ? colors[0] : colors[1]}
        onClick={() => {
          setValue(values[1]);
        }}
        disabled={disabled}
      >
        {nodes[1]}
      </Button>
    </ButtonGroup>
  );
};

export default ButtonGroupSwitch;
