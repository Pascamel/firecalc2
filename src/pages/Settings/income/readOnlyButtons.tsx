import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

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
    <Button color="link" onClick={edit}>
      <Icon icon="edit" size="lg" />
    </Button>
    <Button color="link" onClick={remove}>
      <Icon icon="trash-alt" size="lg" />
    </Button>
    <Button color="link" disabled={index === 0}>
      <Icon icon="chevron-up" size="lg" />
    </Button>
    <Button color="link" disabled={index >= bank.headers.incomes.length - 1}>
      <Icon icon="chevron-down" size="lg" />
    </Button>
  </>
);

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank
  };
};

export default connect(mapStateToProps)(ReadOnlyButtons);
