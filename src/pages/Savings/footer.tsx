import React, { Component } from 'react';
import { Bank } from '../../bank';
import StaticAmount from '../../components/staticAmount';

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
            <StaticAmount bank={bank}>
              { bank.grandTotalInstitution[amount.id][amount.type] }
            </StaticAmount>
          </td>
          ))}
          <td>Total</td>
          <td className="table-warning">
            <StaticAmount bank={bank}>
              { bank && bank.grandTotalHolding }
            </StaticAmount>
          </td>
          <td colSpan={3}></td>
        </tr>
      </tfoot>
    );
  }
}
