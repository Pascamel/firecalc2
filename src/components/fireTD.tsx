import _ from 'lodash';
import React from 'react';

interface IProps {
  show?: boolean;
  hide?: boolean;
  goal?: number;
  threshold?: number;
  span?: number;
  children?: any;
}

const FireTD = (props: IProps) => {
  const classNames = [];

  if (_.has(props, 'show') && !(props.show || false)) {
    classNames.push('hidden');
  }  
  if (_.has(props, 'hide') && props.hide) {
    classNames.push('hidden');
  } 
  if (_.has(props, 'goal') && _.has(props, 'threshold')) {
    classNames.push(((props.goal || 0) >= (props.threshold || 0)) ? 'table-success' : 'table-danger');
  }

  let colSpan = 1;
  if (_.has(props, 'span')) colSpan = props.span || 1;

  return (
    <td className={classNames.join(' ')} colSpan={colSpan}>
      {props.children}
    </td>
  );

}

export default FireTD;
