import React from 'react';

import { Icon } from '../../../components';

interface IProps {
  confirm: () => void;
  cancel: () => void;
}

const EditButtons = ({ confirm, cancel }: IProps) => (
  <>
    <span className="btn btn-link" onClick={confirm}>
      <Icon icon="check" size="lg" />
    </span>
    <span className="btn btn-link" onClick={cancel}>
      <Icon icon="times" size="lg" />
    </span>
  </>
);

export default EditButtons;
