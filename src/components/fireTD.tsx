import React from 'react';

import { joinFilter } from '../helpers';

interface IProps {
  show?: boolean;
  hide?: boolean;
  goal?: number;
  threshold?: number;
  span?: number;
  children?: React.ReactNode;
}

const FireTD = (props: IProps) => {
  const classNames = joinFilter(
    'show' in props && !(props.show || false) ? 'hidden' : null,
    'hide' in props && props.hide ? 'hidden' : null,
    'goal' in props && 'threshold' in props
      ? (props.goal || 0) >= (props.threshold || 0)
        ? 'table-success'
        : 'table-danger'
      : null
  );

  let colSpan = 1;
  if ('span' in props) colSpan = props.span || 1;

  return (
    <td className={classNames} colSpan={colSpan}>
      {props.children}
    </td>
  );
};

export default FireTD;
