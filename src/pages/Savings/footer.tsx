import React from 'react';
import { connect } from 'react-redux';

import Bank from '../../bank';
import { Icon, StaticAmount } from '../../components';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
}

const Footer = ({ bank }: IProps) => {
  return (
    <tfoot>
      <tr>
        <td>
          <Icon icon="university" />
        </td>
        {bank.savingsInputsHidden.map(amount => (
          <td className="table-warning" key={amount.id + amount.type}>
            <StaticAmount display-zero>
              {bank.grandTotalInstitution[amount.id][amount.type]}
            </StaticAmount>
          </td>
        ))}
        <td>Total</td>
        <td className="table-warning">
          <StaticAmount display-zero>
            {bank && bank.grandTotalHolding}
          </StaticAmount>
        </td>
        <td colSpan={3}></td>
      </tr>
    </tfoot>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank
  };
};

export default connect(mapStateToProps)(Footer);
