import _ from 'lodash';
import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Col, CustomInput, Input, Label, Row } from 'reactstrap';

import { deleteExpenseHeader, switchExpenseHeaders, updateExpenseHeader } from '../../actions';
import Bank, { IExpenseHeader } from '../../bank';
import { ButtonGroupSwitch, Icon, MonthYearPicker, Text } from '../../components';
import CATEGORIES from '../../constants/expenseCategories';
import { amount, currentYear, labelMonth } from '../../helpers';
import { AppState } from '../../store';

interface IProps {
  index: number;
  header: IExpenseHeader;
  bank: Bank.IBank;
  onUpdateExpenseHeader: (header: IExpenseHeader) => void;
  onDeleteExpenseHeader: (header: IExpenseHeader) => void;
  onSwitchExpenseHeaders: (index1: number, index2: number) => void;
}

const Expense = ({
  index,
  header,
  bank,
  onUpdateExpenseHeader,
  onDeleteExpenseHeader,
  onSwitchExpenseHeaders,
}: IProps) => {
  const [edit, setEdit] = useState(false);
  const [editLabel, setEditLabel] = useState(header.label);
  const [editType, setEditType] = useState(header.type);
  const [editNecessary, setEditNecessary] = useState(header.isNecessary);
  const [editStartMonth, setEditStartMonth] = useState(header.startMonth);
  const [editStartYear, setEditStartYear] = useState(header.startYear);
  const [editAmount, setEditAmount] = useState(header.amount);

  const editHeaderConfirm = () => {
    header.label = editLabel;
    header.type = editType;
    header.isNecessary = editNecessary;
    header.startMonth = editStartMonth;
    header.startYear = editStartYear;
    header.amount = editAmount;

    onUpdateExpenseHeader(header);
    setEdit(false);
  };

  const editHeaderCancel = () => {
    setEdit(false);
    setEditLabel(header.label || '');
    setEditType(header.type);
    setEditNecessary(header.isNecessary);
    setEditStartMonth(header.startMonth);
    setEditStartYear(header.startYear);
    setEditAmount(header.amount);
  };

  const moveUpHeader = (index: number) => {
    if (index <= 0 || index >= bank.headers.incomes.length) return;

    onSwitchExpenseHeaders(index - 1, index);
  };

  const moveDownHeader = (index: number) => {
    if (index < 0 || index >= bank.headers.incomes.length - 1) return;

    onSwitchExpenseHeaders(index, index + 1);
  };

  const categoryName = _(CATEGORIES)
    .values()
    .keyBy('id')
    .get(header.type, { name: 'N/A' }).name;

  const futureLabel = [
    `$${amount(header.amount || 0, true, true)}`,
    'starts on',
    labelMonth(
      header.startMonth?.toString() ?? '',
      header.startYear?.toString() ?? ''
    ),
  ].join(' ');

  return !edit ? (
    <Row className="form-headers">
      <Col xs={12} sm={3}>
        <Text className="label-fake-input">{header.label}</Text>
      </Col>
      <Col xs={6} sm={2}>
        <span className="label-fake-input">{categoryName}</span>
      </Col>
      <Col xs={6} sm={2}>
        <span className="label-fake-input">
          {header.isNecessary ? 'Necessary' : 'Discretionary'}
        </span>
      </Col>
      {header.isFuture && (
        <Col xs={6} sm={3}>
          <span className="label-fake-input">{futureLabel}</span>
        </Col>
      )}
      <Col xs={12} sm={header.isFuture ? 2 : 5} className="text-right">
        <Button color="link" onClick={() => setEdit(true)}>
          <Icon icon="edit" size="lg" />
        </Button>
        <Button color="link" onClick={() => onDeleteExpenseHeader(header)}>
          <Icon icon="trash-alt" size="lg" />
        </Button>
        <Button
          color="link"
          disabled={index === 0}
          onClick={() => moveUpHeader(index)}
        >
          <Icon icon="chevron-up" size="lg" />
        </Button>
        <Button
          color="link"
          disabled={index >= bank.headers.savings.length - 1}
          onClick={() => moveDownHeader(index)}
        >
          <Icon icon="chevron-down" size="lg" />
        </Button>
      </Col>
    </Row>
  ) : (
    <Row className="form-headers">
      <Col xs={12} sm={3}>
        <Label className="display-block">Label</Label>
        <Input
          type="text"
          value={editLabel}
          onChange={(e) => setEditLabel(e.target.value)}
          className="form-control"
        />
      </Col>
      <Col xs={6} sm={2}>
        <Label className="display-block">Type</Label>
        <CustomInput
          id={`category-${header.id}`}
          type="select"
          value={editType || 0}
          onChange={(e) => setEditType(parseInt(e.target.value))}
        >
          <option></option>
          {Object.values(CATEGORIES).map(
            (category: { id: number; name: string }) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            )
          )}
        </CustomInput>
      </Col>
      <Col xs={6} sm={2}>
        <Label className="display-block">Necessary</Label>
        <ButtonGroupSwitch
          className="d-flex"
          disabled={!edit}
          value={editNecessary}
          setValue={setEditNecessary}
          colors={['primary', 'light']}
          values={[true, false]}
          nodes={['Yes', 'No']}
        />
      </Col>
      {header.isFuture && (
        <>
          <Col xs={8} sm={3}>
            <Label className="display-block">Type</Label>
            <MonthYearPicker
              inputId={`start-${header.id}`}
              month={editStartMonth || 0}
              setMonth={setEditStartMonth}
              month-range={[1, 13]}
              year={editStartYear || 0}
              setYear={setEditStartYear}
              year-range={[currentYear(), currentYear() + 20]}
            />
          </Col>
          <Col xs={4} sm={2}>
            <Label className="display-block">Amount</Label>
            <Input
              type="text"
              value={editAmount || 0}
              onChange={(e) => setEditAmount(parseInt(e.target.value))}
              className="form-control"
            />
          </Col>
        </>
      )}

      <Col xs={12} className="text-right mt-3">
        <Button color="outline-primary" onClick={editHeaderCancel}>
          <Icon icon="times" className="mr-1" /> Cancel
        </Button>
        <Button color="primary" className="ml-3" onClick={editHeaderConfirm}>
          <Icon icon="check" className="mr-1" /> Confirm
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onUpdateExpenseHeader: (header: IExpenseHeader) => {
      dispatch(updateExpenseHeader(header));
    },
    onDeleteExpenseHeader: (header: IExpenseHeader) => {
      dispatch(deleteExpenseHeader(header));
    },
    onSwitchExpenseHeaders: (index1: number, index2: number) => {
      dispatch(switchExpenseHeaders(index1, index2));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Expense);
