import _ from 'lodash';
import React from 'react';

interface IProps {
  show?: boolean,
  hide?: boolean,
}

export default class FireTR extends React.Component<IProps, {}> {
  render() {
    const classNames = [];

    if (_.has(this.props, 'show') && !(this.props.show || false)) {
      classNames.push('hidden');
    }  
    if (_.has(this.props, 'hide') && this.props.hide) {
      classNames.push('hidden');
    }

    return (
      <tr className={classNames.join(' ')}>
        {this.props.children}
      </tr>
    );
  }
}