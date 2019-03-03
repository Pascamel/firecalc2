import React, { Component } from 'react';
import { Bank } from '../../bank';

interface IProps {
  bank: Bank
}

interface IState {}

export default class Footer extends Component<IProps, IState> {
  render() {
    const {bank} = this.props;

    return (
      <tfoot>
        <tr>
          <td><i className="fa fa-university"></i></td>
          {bank.savingsInputsHidden.map((amount: any, key: number) => (
          <td className="table-warning" key={key}>
            { bank.grandTotalInstitution(amount.id, amount.type, true) }
          </td>
          ))}
          <td>Total</td>
          <td className="table-warning">{ bank && bank.grandTotalHolding() }</td>
          <td colSpan={3}></td>
        </tr>
      </tfoot>
    );
  }
}
