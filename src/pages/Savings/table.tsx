import React from 'react';
import { connect } from 'react-redux';

import Bank from '../../bank';
import { AppState } from '../../store';
import Body from './body';
import Footer from './footer';
import Header from './header';

interface IProps {
  bank: Bank.IBank;
}

const Table = ({ bank }: IProps) => {
  return (
    <table className="table table-striped table-finances">
      <Header />
      {Object.entries(bank.savings).map(year => (
        <Body key={year[0]} year={year[0]} />
      ))}
      <Footer />
    </table>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank
  };
};

export default connect(mapStateToProps)(Table);
