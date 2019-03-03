import React, { Component } from 'react';
import Header from './header';
import Body from './body';
import { Bank } from '../../bank';

interface IProps {
  bank: Bank,
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}
interface IState {}

export default class Table extends Component<IProps, IState> {
  render() {
    const { bank } = this.props;

    return (
      <table className="table table-striped table-finances">
        <Header {...this.props} />
        {Object.entries(bank.income).map((year) => (
        <Body key={year[0]} year={year[0]} {...this.props} />
        ))}
      </table>
    );
  }
}
