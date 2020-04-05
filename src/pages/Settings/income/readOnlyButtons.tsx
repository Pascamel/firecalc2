import React from 'react';
import { connect } from 'react-redux';

import Bank from '../../../bank';
import { Icon } from '../../../components';
import { AppState } from '../../../store';

interface IProps {
  bank: Bank.IBank;
  index: number;
  edit: () => void;
  remove: () => void;
  up: (index: number) => void;
  down: (index: number) => void;
}

const ReadOnlyButtons = ({ index, bank, edit, remove, up, down }: IProps) => (
  <>
    <span className="btn btn-link" onClick={edit}>
      <Icon icon="edit" size="lg" />
    </span>
    <span className="btn btn-link" onClick={remove}>
      <Icon icon="trash-alt" size="lg" />
    </span>
    <span
      className={`btn btn-link ${index === 0 ? 'disabled' : ''}`}
      onClick={e => up(index)}
    >
      <Icon icon="chevron-up" size="lg" />
    </span>
    <span
      className={`btn btn-link ${
        index >= bank.headers.incomes.length - 1 ? 'disabled' : ''
      }`}
      onClick={e => down(index)}
    >
      <Icon icon="chevron-down" size="lg" />
    </span>
  </>
);

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank
  };
};

export default connect(mapStateToProps)(ReadOnlyButtons);
