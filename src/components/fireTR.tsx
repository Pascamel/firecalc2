import React from 'react';

interface IProps {
  show?: boolean;
  hide?: boolean;
  children?: any;
}

const FireTR = (props: IProps) => {
  const classNames = [];

  if ('show' in props && !(props.show || false)) {
    classNames.push('hidden');
  }
  if ('hide' in props && props.hide) {
    classNames.push('hidden');
  }

  return <tr className={classNames.join(' ')}>{props.children}</tr>;
};

export default FireTR;
