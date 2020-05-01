import React from 'react';

import { joinFilter } from '../helpers';

interface IProps {
  show?: boolean;
  hide?: boolean;
  children?: React.ReactNode;
}

const FireTR = (props: IProps) => (
  <tr
    className={joinFilter(
      'show' in props && !(props.show || false) ? 'hidden' : null,
      'hide' in props && props.hide ? 'hidden' : null
    )}
  >
    {props.children}
  </tr>
);

export default FireTR;
