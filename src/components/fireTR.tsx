import _ from 'lodash';
import React from 'react';

interface IProps {
  show?: boolean;
  hide?: boolean;
  children?: any;
}

const FireTR = (props: IProps) => {
  const classNames = [];

  if (_.has(props, 'show') && !(props.show || false)) {
    classNames.push('hidden');
  }
  if (_.has(props, 'hide') && props.hide) {
    classNames.push('hidden');
  }

  return <tr className={classNames.join(' ')}>{props.children}</tr>;
};

export default FireTR;
