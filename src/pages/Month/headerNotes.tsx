import _ from 'lodash';
import React, { ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Input, Row } from 'reactstrap';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { updateValue } from '../../actions';
import Bank from '../../bank';
import { FireAmount, Icon, Text } from '../../components';
import { labelMonth } from '../../helpers';
import { AppState } from '../../store';

interface IProps {
  month: string;
  year: string;
  bank: Bank.IBank;
  bankLoaded: boolean;
  onUpdateValue: (
    index: string,
    indexes: string[],
    label: string,
    previous: string,
    text: string
  ) => void;
}

const HeaderNotes = ({
  bank,
  bankLoaded,
  year,
  month,
  onUpdateValue,
}: IProps) => {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState('');
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (bankLoaded) {
      setValue(_.get(bank, ['notes', year, month], ''));
    }
    setEdit(false);
  }, [bankLoaded, bank, year, month]);

  const editMode = (e: MouseEvent<HTMLElement>) => {
    if (edit) return;

    setEdit(true);
    setEditValue(value);
  };

  const change = (e: ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const keyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      const element = document.getElementById(
        'notesTextArea'
      ) as HTMLTextAreaElement;
      const begin = element.selectionStart;
      const end = element.selectionEnd;

      setEditValue(
        element.value.substring(0, begin) +
          '\n' +
          element.value.substring(end, element.value.length)
      );
      setTimeout(() => {
        element.setSelectionRange(begin + 1, end + 1);
      }, 10);
    } else if (e.key === 'Enter') {
      setValue(editValue);
      setEdit(false);
      onUpdateValue(
        'notes',
        [year, month],
        `Notes for month ${labelMonth(month, year)}`,
        value,
        editValue
      );
    } else if (e.key === 'Escape') {
      setEdit(false);
    }
  };

  return (
    <Alert color="background">
      <Row className="month-amount net-worth">
        <Col>
          <Text className="label-fake-input">Net Worth</Text>
        </Col>
        <Col>
          <FireAmount
            extraClassName="label-fake-input pull-right"
            classNameInput="pull-right"
            display-if-zero={true}
            callback-props={['networth', year, month]}
          />
        </Col>
      </Row>
      <Row className="month-amount notes">
        <Col onClick={editMode}>
          {!edit && (
            <Text className="text-newline">
              {value && value.length ? value : 'Add notes'}
              {value?.length === 0 && <Icon icon="pen" className="ml-2" />}
            </Text>
          )}
          {edit && (
            <Input
              id="notesTextArea"
              innerRef={(input) => {
                input?.focus();
              }}
              type="textarea"
              value={editValue}
              onChange={change}
              onKeyDown={keyDown}
            />
          )}
        </Col>
      </Row>
    </Alert>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, void, AnyAction>
) => {
  return {
    onUpdateValue: (
      index: string,
      indexes: string[],
      label: string,
      previous: string,
      text: string
    ) => {
      dispatch(updateValue(index, indexes, label, previous, text));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderNotes);
