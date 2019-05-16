import React from 'react';
import { connect } from 'react-redux';

import * as Bank from '../../bank';
import { AppState } from '../../store';
import Body from './body';
import Header from './header';

interface IProps {
  bank: Bank.IBank
}

class Table extends React.Component<IProps, {}> {
  render() {
    const { bank } = this.props;

    return (
      <table className="table table-striped table-finances">
        <Header />
        {Object.entries(bank.income).map((year) => (
        <Body key={year[0]} year={year[0]} />
        ))}
      </table>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank
  });
}

export default connect(mapStateToProps)(Table);
