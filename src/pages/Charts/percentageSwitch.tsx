import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';

interface IProps {
  percentage: boolean;
  callback: (b: boolean) => void;
}

const PercentageSwitch = (props: IProps) => {
  const { callback, percentage } = props;

  const _onClick = (b: boolean) => {
    callback && callback(b);
  };

  return (
    <ButtonGroup style={{ width: '100%' }} color="light" className="mb-3">
      <Button
        onClick={() => _onClick(false)}
        disabled={!percentage}
        color={!percentage ? 'secondary' : 'outline-secondary'}
      >
        $
      </Button>
      <Button
        onClick={() => _onClick(true)}
        disabled={percentage}
        color={percentage ? 'secondary' : 'outline-secondary'}
      >
        %
      </Button>
    </ButtonGroup>
  );
};

export default PercentageSwitch;
