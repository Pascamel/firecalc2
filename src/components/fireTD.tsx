import React from 'react';

interface IProps {
  show?: boolean;
  hide?: boolean;
  goal?: number;
  threshold?: number;
  span?: number;
  children?: JSX.Element;
}

const FireTD = (props: IProps) => {
  const classNames = [];

  if ('show' in props && !(props.show || false)) {
    classNames.push('hidden');
  }
  if ('hide' in props && props.hide) {
    classNames.push('hidden');
  }
  if ('goal' in props && 'threshold' in props) {
    classNames.push(
      (props.goal || 0) >= (props.threshold || 0)
        ? 'table-success'
        : 'table-danger'
    );
  }

  let colSpan = 1;
  if ('span' in props) colSpan = props.span || 1;

  return (
    <td className={classNames.join(' ')} colSpan={colSpan}>
      {props.children}
    </td>
  );
};

export default FireTD;
