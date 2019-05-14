import React from 'react';
import * as Bank from '../../bank';
import { StaticAmount } from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps {
  bank: Bank.IBank
}

interface IState {}

export default class Footer extends React.Component<IProps, IState> {
  render() {
    const {bank} = this.props;

    return (
      <tfoot>
        <tr>
          <td>
            <FontAwesomeIcon icon="university" />
          </td>
          {bank.savingsInputsHidden.map((amount: any, key: number) => (
          <td className="table-warning" key={key}>
            <StaticAmount bank={bank} display-zero>
              { bank.grandTotalInstitution[amount.id][amount.type] }
            </StaticAmount>
          </td>
          ))}
          <td>Total</td>
          <td className="table-warning">
            <StaticAmount bank={bank} display-zero>
              { bank && bank.grandTotalHolding }
            </StaticAmount>
          </td>
          <td colSpan={3}></td>
        </tr>
      </tfoot>
    );
  }
}
