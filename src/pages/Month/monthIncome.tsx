import React from 'react';
import _ from 'lodash';
import { FireAmount } from '../../components';
import { Bank } from '../../bank';


interface IProps {
  bank: Bank,
  header: any,
  month: string,
  year: string, 
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
  data: string
}

interface IState {
  label: string
}

export default class MonthIncome extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      label: _(props.bank.incomeHeaders).keyBy('id').get([props.header.id, 'label'], 'N/A')
    };
  }
  
  render () {
    const { header, month, year, callback, data, bank } = this.props;

    return (
      <React.Fragment>
        <div className="month-amount">
          <span className="label-fake-input smaller mb-1">{this.state.label}</span>
          <div className="pull-right">
            <FireAmount amount={parseFloat(_.get(data, header.id))} 
                        extraClassName="label-fake-input"
                        display-if-zero={true}
                        display-decimals={bank.showDecimals}
                        callback-props={['income', year, month, header.id]} 
                        callback={callback} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
