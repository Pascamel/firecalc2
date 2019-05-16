import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import * as Bank from '../bank';
import helpers from '../helpers';
import { AppState } from '../store';

interface IProps {
  Bank: Bank.IBank;
  children: number;
}

class StaticPercentage extends React.Component<IProps, {}> {
  render() {
    return (
      <React.Fragment>
        {helpers.percentage(this.props.children)}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank
  });
}

export default connect(mapStateToProps)(StaticPercentage);
