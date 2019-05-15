import React from 'react';
import { connect } from 'react-redux';

import * as Bank from '../../bank';
import Body from './body';
import Footer from './footer';
import Header from './header';

interface IProps {
  bank: Bank.IBank
}

class SavingsTable extends React.Component<IProps, {}> {
  render() {
    const {bank} = this.props;

    return (
      <table className="table table-striped table-finances">
        <Header />
        {Object.entries(bank.savings).map((year) => (
        <Body key={year[0]} year={year[0]} />
        ))}
        <Footer {...this.props} />
      </table>
    );
  }
}

const mapStateToProps = (state: any) => {
  return ({
    bank: state.bankState.bank
  });
}

export default connect(mapStateToProps)(SavingsTable);