import React from 'react';
import { Button } from 'reactstrap';

import { Icon } from '../../../components';

interface IProps {
  confirm: () => void;
  cancel: () => void;
}

const EditButtons = ({ confirm, cancel }: IProps) => (
  <>
    <Button color="link" onClick={confirm}>
      <Icon icon="check" size="lg" />
    </Button>
    <Button color="link" onClick={cancel}>
      <Icon icon="times" size="lg" />
    </Button>
  </>
);

export default EditButtons;
