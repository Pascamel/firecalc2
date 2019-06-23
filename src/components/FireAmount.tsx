import _ from 'lodash';
import math from 'mathjs';
import React, { Dispatch } from 'react';
import { connect } from 'react-redux';

import { updateValue } from '../actions';
import Bank from '../bank';
import helpers from '../helpers';
import { AppState } from '../store';

interface IProps {
  bank: Bank.IBank;
  extraClassName?: string;
  ['callback-props']: string[];
  ['display-if-zero']?: boolean;
  onUpdateValue: (index: string, indexes: string[], amount: number) => void;
}

interface IState {
  edit: boolean;
  extraClassName: string;
  readonly: boolean;
  amount: number;
  inputValue: string;
  displayIfZero: boolean;
}

class FireAmount extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      readonly: _.last(props['callback-props']) === 'T',
      extraClassName: props.extraClassName || '',
      edit: false, 
      amount: _.get(props.bank, props['callback-props'], 0), 
      inputValue: _.get(props.bank, props['callback-props'], 0) ? _.get(props.bank, props['callback-props'], 0).toString() : '',
      displayIfZero: props['display-if-zero'] || false
    };
  }

  setEditMode = () => {
    if (this.state.readonly) return;
    this.setState({edit: true, amount: _.get(this.props.bank, this.props['callback-props'], 0) });
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({inputValue: e.target.value});
  }

  confirmEdit = () => {
    const s = (this.state.inputValue || '').replace(',','').replace('$','');

    if (!RegExp('^([0-9()*/.+-])+$').test(s)) return;
  
    const val = (math.eval(s) || 0).toString();

    this.setState({
      edit: false, 
      amount: val
    });

    const indexes = this.props['callback-props'];
    const index = indexes.shift() || '';

    this.props.onUpdateValue(index, indexes, parseFloat(val) || 0);
  }

  cancelEdit = () => {
    this.setState({edit: false});
  }

  handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!this || !this.state || !this.state.edit) return;

    if (event.key === 'Enter') this.confirmEdit();
    if (event.key === 'Escape') this.cancelEdit();
  }

  handleKeyDown (event: React.KeyboardEvent<HTMLInputElement>) {
    if (!this || !this.state || !this.state.edit) return;

    if (event.key === 'Enter') this.confirmEdit();
    if (event.key === 'Escape') this.cancelEdit();
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.props['callback-props'] === prevProps['callback-props']) return;

    this.setState({
      edit: false, 
      amount: _.get(this.props.bank, this.props['callback-props'], 0), 
      inputValue: _.get(this.props.bank, this.props['callback-props'], 0) ? _.get(this.props.bank, this.props['callback-props'], 0).toString() : ''
    });
  }

  render() {
    const { readonly, edit, extraClassName, displayIfZero } = this.state;

    return (
      <div className={`amount-container ${readonly ? 'read-only' : ''} ${extraClassName}`} onKeyDown={this.handleKeyDown}>
        {!edit && <span className="amount" onClick={this.setEditMode}>
          { helpers.amount(this.state.amount, displayIfZero, this.props.bank.showDecimals || false) }
        </span>}
        {edit && <input
          ref={(input) => {if (input != null) input.focus();}}
          className="form-control"
          defaultValue={this.state.amount ? this.state.amount.toString() : ''} 
          onChange={(value: React.ChangeEvent<HTMLInputElement>) => this.onChange(value)} 
          onKeyUp={this.handleKeyUp}  
        />}
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank,
    bankUpdated: state.bankState.bankUpdated
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onUpdateValue: (index: string, indexes: string[], amount: number) => {
      dispatch(updateValue(index, indexes, amount));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FireAmount);
