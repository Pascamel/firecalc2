import React from 'react';

import * as Bank from '../../bank';
import Body from './body';
import Footer from './footer';
import Header from './header';

interface IProps {
  bank: Bank.IBank,
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

interface IState {}

export default class SavingsTable extends React.Component<IProps, IState> {
  render() {
    const {bank} = this.props;

    return (
      <table className="table table-striped table-finances">
        <Header {...this.props} />
        {Object.entries(bank.savings).map((year) => (
        <Body key={year[0]} year={year[0]} {...this.props} />
        ))}
        <Footer {...this.props} />
      </table>
    );
  }
}
