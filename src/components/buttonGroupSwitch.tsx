import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';

interface IProps<T> {
  className?: string;
  value: number | boolean;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  colors: Array<string>;
  values: Array<T>;
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
}: IProps<number> | IProps<boolean>) => {
  value = value ?? false;

  return (
    <ButtonGroup className={className}>
      <Button
        color={value === values[0] ? colors[0] : colors[1]}
        onClick={() => {
          setValue(values[0] as any);
        }}
        disabled={disabled}
      >
        {nodes[0]}
      </Button>
      <Button
        color={value === values[1] ? colors[0] : colors[1]}
        onClick={() => {
          setValue(values[1] as any);
        }}
        disabled={disabled}
      >
        {nodes[1]}
      </Button>
    </ButtonGroup>
  );
};

export default ButtonGroupSwitch;
