import _ from 'lodash';
import math from 'mathjs';
import React from 'react';

import helpers from '../helpers';

interface IProps {
  amount: number,
  extraClassName?: string,
  ['callback-props']: string[],
  ['display-if-zero']?: boolean,
  ['display-decimals']: boolean,
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

interface IState {
  edit: boolean,
  extraClassName: string,
  readonly: boolean,
  amount: number,
  inputValue: string,
  displayIfZero: boolean
}

export default class FireAmount extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    
    this.state = {
      readonly: _.last(props['callback-props']) === 'T',
      extraClassName: props.extraClassName || '',
      edit: false, 
      amount: props.amount,
      inputValue: props.amount ? props.amount.toString() : '',
      displayIfZero: props['display-if-zero'] || false
    };
  }

  setEditMode = () => {
    if (this.state.readonly) return;
    this.setState({edit: true, amount: this.props.amount });
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({inputValue: e.target.value});
  }

  confirmEdit = () => {
    const s = (this.state.inputValue || '').replace(',','').replace('$','');
    const validate = RegExp('^([0-9()*/.+-])+$');

    if (!validate.test(s)) return;
  
    const val = (math.eval(s) || 0).toString();

    this.setState({
      edit: false, 
      amount: val
    });

    const indexes = this.props['callback-props'];
    const index = indexes.shift() || '';

    this.props.callback(index, indexes, parseFloat(val) || 0, true);
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

  render() {
    if (!this) return;

    const { readonly, edit, extraClassName, displayIfZero } = this.state;

    return (
      <div className={`amount-container ${readonly ? 'read-only' : ''} ${extraClassName}`} onKeyDown={this.handleKeyDown}>
        {!edit && <span className="amount" onClick={this.setEditMode}>
          { helpers.amount(this.props.amount, displayIfZero, this.props['display-decimals'] || false) }
        </span>}
        {edit && <input
          ref={(input) => {if (input != null) input.focus();}}
          className="form-control"
          defaultValue={this.state.amount ? this.state.amount.toString() : ''} 
          onChange={(value:React.ChangeEvent<HTMLInputElement>) => this.onChange(value)} 
          onKeyUp={this.handleKeyUp}  
        />}
      </div>
    );
  }
}
