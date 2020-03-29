import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';

import {
  deleteIncomeHeader,
  switchIncomeHeaders,
  updateIncomeHeader
} from '../../actions';
import Bank, { IIncomeHeader } from '../../bank';
import { Text } from '../../components';
import { AppState } from '../../store';

interface IProps {
  index: number;
  header: IIncomeHeader;
  bank: Bank.IBank;
  bankLoaded: boolean;
  onUpdateIncomeHeader: (header: IIncomeHeader) => void;
  onDeleteIncomeHeader: (header: IIncomeHeader) => void;
  onSwitchIncomeHeaders: (index1: number, index2: number) => void;
}

const Income = (props: IProps) => {
  const {
    index,
    header,
    bank,
    bankLoaded,
    onUpdateIncomeHeader,
    onDeleteIncomeHeader,
    onSwitchIncomeHeaders
  } = props;
  const [edit, setEdit] = useState(false);
  const [editLabel, setEditLabel] = useState(header.label);
  const [editPretax, setEditPretax] = useState(header.pretax);
  const [editCount, setEditCount] = useState(header.count);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'editLabel') setEditLabel(event.target.value);
    if (event.target.name === 'editPretax') setEditPretax(event.target.checked);
    if (event.target.name === 'editCount')
      setEditCount(parseInt(event.target.value));
  };

  const editHeader = () => {
    setEdit(true);
  };

  const editHeaderConfirm = () => {
    header.label = editLabel;
    header.pretax = editPretax;
    header.count = editCount;

    onUpdateIncomeHeader(header);
    setEdit(false);
  };

  const editHeaderCancel = () => {
    setEdit(false);
    setEditLabel(header.label || '');
    setEditPretax(header.pretax || false);
    setEditCount(header.count || 1);
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

  if (!bankLoaded) return null;

  return (
    <Row className="form-headers">
      <Col xs={12} sm={6}>
        {!edit && <span className="label-fake-input">{header.label}</span>}
        {edit && (
          <input
            type="text"
            name="editLabel"
            value={editLabel}
            onChange={handleInputChange}
            className="form-control"
          />
        )}
      </Col>
      <Col xs={7} sm={3}>
        <div className="inline">
          {!edit && (
            <FontAwesomeIcon
              icon={['far', header.pretax ? 'check-square' : 'square']}
            />
          )}
          <label>
            {edit && (
              <input
                type="checkbox"
                name="editPretax"
                defaultChecked={editPretax}
                onChange={handleInputChange}
              />
            )}
            <Text className="ml-1">Pre-tax</Text>
          </label>
        </div>
        {!edit && (
          <div className="btn-group ml-3">
            <label
              className={`disabled btn ${
                header.count === 1 ? 'btn-secondary' : 'btn-light'
              }`}
            >
              1
            </label>
            <label
              className={`disabled btn ${
                header.count === 2 ? 'btn-secondary' : 'btn-light'
              }`}
            >
              2
            </label>
          </div>
        )}
        {edit && (
          <div className="btn-group ml-3">
            <label
              className={`btn ${editCount === 1 ? 'btn-primary' : 'btn-light'}`}
              onClick={e => {
                setEditCount(1);
              }}
            >
              1
            </label>
            <label
              className={`btn ${editCount === 2 ? 'btn-primary' : 'btn-light'}`}
              onClick={e => {
                setEditCount(2);
              }}
            >
              2
            </label>
          </div>
        )}
      </Col>
      <Col xs={5} sm={3} className="text-right">
        {edit && (
          <span className="btn btn-link" onClick={editHeaderConfirm}>
            <FontAwesomeIcon icon="check" size="lg" />
          </span>
        )}
        {edit && (
          <span className="btn btn-link" onClick={editHeaderCancel}>
            <FontAwesomeIcon icon="times" size="lg" />
          </span>
        )}
        {!edit && (
          <span className="btn btn-link" onClick={editHeader}>
            <FontAwesomeIcon icon="edit" size="lg" />
          </span>
        )}
        {!edit && (
          <span className="btn btn-link" onClick={removeHeader}>
            <FontAwesomeIcon icon="trash-alt" size="lg" />
          </span>
        )}
        {!edit && (
          <span
            className={`btn btn-link ${index === 0 ? 'disabled' : ''}`}
            onClick={e => moveUpHeader(index)}
          >
            <FontAwesomeIcon icon="chevron-up" size="lg" />
          </span>
        )}
        {!edit && (
          <span
            className={`btn btn-link ${
              index >= bank.headers.incomes.length - 1 ? 'disabled' : ''
            }`}
            onClick={e => moveDownHeader(index)}
          >
            <FontAwesomeIcon icon="chevron-down" size="lg" />
          </span>
        )}
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onUpdateIncomeHeader: (header: IIncomeHeader) => {
      dispatch(updateIncomeHeader(header));
    },
    onDeleteIncomeHeader: (header: IIncomeHeader) => {
      dispatch(deleteIncomeHeader(header));
    },
    onSwitchIncomeHeaders: (index1: number, index2: number) => {
      dispatch(switchIncomeHeaders(index1, index2));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Income);
