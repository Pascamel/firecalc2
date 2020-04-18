import React, { Dispatch } from 'react';
import { connect } from 'react-redux';

import { newExpenseHeader } from '../../actions';
import Bank, { ISavingsHeader } from '../../bank';
import { AppState } from '../../store';

interface IProps {
  bank: Bank.IBank;
  bankLoaded: boolean;
  onNewExpenseHeader: () => void;
}

const Expenses = ({ bank, bankLoaded, onNewExpenseHeader }: IProps) => {
  if (!bankLoaded) {
    return null;
  }

  return <span>todo</span>;
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onNewSavingHeader: () => {
      dispatch(newExpenseHeader());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Expenses);
