import React from 'react';
import helpers from '../helpers';
import * as _ from 'lodash';

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
    if (_.has(this.props, 'show')) classNames.push(helpers.showIf(this.props.show || false));
    if (_.has(this.props, 'hide')) classNames.push(helpers.hideIf(this.props.hide || false));
    if (_.has(this.props, 'goal') && _.has(this.props, 'threshold')) {
      classNames.push(helpers.goal(this.props.goal || 0, this.props.threshold || 0));
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
