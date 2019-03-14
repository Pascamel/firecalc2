import React from 'react';
import _ from 'lodash';

interface IProps {
  show?: boolean,
  hide?: boolean,
  goal?: number,
  threshold?: number,
  span?: number
}

export default class FireTD extends React.Component<IProps, {}> {
  render () {
    const classNames = [];

    if (_.has(this.props, 'show') && !(this.props.show || false)) {
      classNames.push('hidden');
    }  
    if (_.has(this.props, 'hide') && this.props.hide) {
      classNames.push('hidden');
    } 
    if (_.has(this.props, 'goal') && _.has(this.props, 'threshold')) {
      classNames.push(((this.props.goal || 0) >= (this.props.threshold || 0)) ? 'table-success' : 'table-danger');
    }

    let colSpan = 1;
    if (_.has(this.props, 'span')) colSpan = this.props.span || 1;

    return (
      <td className={classNames.join(' ')} colSpan={colSpan}>
        {this.props.children}
      </td>
    );
  }
}
