import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Col, Input, Row } from 'reactstrap';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { deleteIncomeHeader, switchIncomeHeaders, updateIncomeHeader } from '../../../actions';
import Bank, { IIncomeHeader } from '../../../bank';
import { ButtonGroupSwitch, Text } from '../../../components';
import { AppState } from '../../../store';
import EditButtons from './editButtons';
import ReadOnlyButtons from './readOnlyButtons';

interface IProps {
  index: number;
  header: IIncomeHeader;
  bank: Bank.IBank;
  bankLoaded: boolean;
  onUpdateIncomeHeader: (header: IIncomeHeader) => void;
  onDeleteIncomeHeader: (header: IIncomeHeader) => void;
  onSwitchIncomeHeaders: (index1: number, index2: number) => void;
}

const Income = ({
  index,
  header,
  bank,
  bankLoaded,
  onUpdateIncomeHeader,
  onDeleteIncomeHeader,
  onSwitchIncomeHeaders,
}: IProps) => {
  const [edit, setEdit] = useState(false);
  const [editLabel, setEditLabel] = useState(header.label);
  const [editPretax, setEditPretax] = useState(header.pretax);
  const [editCount, setEditCount] = useState(header.count === 2);

  const editHeader = () => {
    setEdit(true);
  };

  const editHeaderConfirm = () => {
    header.label = editLabel;
    header.pretax = editPretax;
    header.count = editCount ? 2 : 1;

    onUpdateIncomeHeader(header);
    setEdit(false);
  };

  const editHeaderCancel = () => {
    setEdit(false);
    setEditLabel(header.label || '');
    setEditPretax(header.pretax || false);
    setEditCount(header.count === 2);
  };

  const removeHeader = () => {
    onDeleteIncomeHeader(header);
  };

  const moveUpHeader = (index: number) => {
    if (index <= 0 || index >= bank.headers.incomes.length) return;

    onSwitchIncomeHeaders(index - 1, index);
  };

  const moveDownHeader = (index: number) => {
    if (index < 0 || index >= bank.headers.incomes.length - 1) return;

    onSwitchIncomeHeaders(index, index + 1);
  };

  if (!bankLoaded) {
    return null;
  }

  return (
    <Row className="form-headers">
      <Col xs={12} sm={6}>
        {!edit && <Text className="label-fake-input">{header.label}</Text>}
        {edit && (
          <Input
            type="text"
            name="editLabel"
            value={editLabel}
            onChange={(event) => setEditLabel(event.target.value)}
            className="form-control"
          />
        )}
      </Col>
      <Col xs={7} sm={4}>
        <ButtonGroupSwitch
          className="mb-2"
          disabled={!edit}
          value={editPretax}
          setValue={setEditPretax}
          colors={['primary', 'light']}
          values={[true, false]}
          nodes={['Pre-tax', 'Post-tax']}
        />
        <ButtonGroupSwitch
          className="mb-2 ml-3"
          disabled={!edit}
          value={editCount}
          setValue={setEditCount}
          colors={['primary', 'light']}
          values={[false, true]}
          nodes={['1', '2']}
        />
      </Col>
      <Col xs={5} sm={2} className="text-right">
        {edit ? (
          <EditButtons confirm={editHeaderConfirm} cancel={editHeaderCancel} />
        ) : (
          <ReadOnlyButtons
            index={index}
            edit={editHeader}
            remove={removeHeader}
            up={moveUpHeader}
            down={moveDownHeader}
          />
        )}
      </Col>
    </Row>
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
    onUpdateIncomeHeader: (header: IIncomeHeader) => {
      dispatch(updateIncomeHeader(header));
    },
    onDeleteIncomeHeader: (header: IIncomeHeader) => {
      dispatch(deleteIncomeHeader(header));
    },
    onSwitchIncomeHeaders: (index1: number, index2: number) => {
      dispatch(switchIncomeHeaders(index1, index2));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Income);
