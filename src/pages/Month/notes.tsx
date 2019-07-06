import _ from 'lodash';
import React, { ChangeEvent, Dispatch, KeyboardEvent, MouseEvent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Alert, Input } from 'reactstrap';

import { loadBank, updateValue } from '../../actions';
import Bank from '../../bank';
import { AppState } from '../../store';

interface IProps {
  month: string;
  year: string;
  bank: Bank.IBank;
  bankLoaded: boolean;
  onUpdateValue: (index: string, indexes: string[], text: string) => void;
}

const Notes = (props: IProps) => {
  const { bank, bankLoaded, year, month, onUpdateValue } = props;
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState('');
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (bankLoaded) setValue(_.get(bank, ['notes', year, month], ''));
    setEdit(false);
  }, [bankLoaded, year, month]);

  const editMode = (e: MouseEvent<HTMLElement>) => {
    if (edit) return;

    setEdit(true);
    setEditValue(value);
  }

  const change = (e: ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  }

  const keyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      setValue(editValue);
      setEdit(false);
      onUpdateValue('notes', [year, month], 'coucou');
    } else if (e.key === 'Escape') {
      setEdit(false);
    }
  }
  
  return (
    <Alert color="background" onClick={editMode}>
      <p><b>Notes</b></p>
      {!edit && <span>{value && value.length ? value : 'No note created yet'}</span>}
      {edit && <Input 
      innerRef={(input) => {if (input != null) input.focus();}}
      type="textarea" value={editValue} onChange={change} onKeyDown={keyDown}  />}
    </Alert>
  )
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onUpdateValue: (index: string, indexes: string[], text: string) => {
      dispatch(updateValue(index, indexes, text));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes);