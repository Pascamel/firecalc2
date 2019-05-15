import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';

import * as Bank from '../../bank';
import { StaticAmount } from '../../components';

interface IProps {
  bank: Bank.IBank
}

class Footer extends React.Component<IProps, {}> {
  render () {
    const { bank } = this.props;

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

const mapStateToProps = (state: any) => {
  return ({
    bank: state.bankState.bank
  });
}

export default connect(mapStateToProps)(Footer);
