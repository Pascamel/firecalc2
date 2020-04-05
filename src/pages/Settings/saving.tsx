import _ from 'lodash';
import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import {
    Button, Col, CustomInput, Input, InputGroup, InputGroupAddon, Label, Row
} from 'reactstrap';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';

import { deleteSavingHeader, switchSavingHeaders, updateSavingHeader } from '../../actions';
import Bank, { ISavingsHeader } from '../../bank';
import { Icon } from '../../components';
import { deepCopy, labelMonth } from '../../helpers';
import { AppState } from '../../store';

interface IProps {
  index: number;
  header: ISavingsHeader;
  bank: Bank.IBank;
  bankLoaded: boolean;
  onUpdateSavingHeader: (header: ISavingsHeader) => void;
  onDeleteSavingHeader: (header: ISavingsHeader) => void;
  onSwitchSavingHeaders: (index1: number, index2: number) => void;
}

const Saving = ({
  index,
  header,
  bank,
  bankLoaded,
  onUpdateSavingHeader,
  onDeleteSavingHeader,
  onSwitchSavingHeaders
}: IProps) => {
  const currentYear = new Date().getFullYear();
  const [edit, setEdit] = useState(false);
  const [editLabel, setEditLabel] = useState(header.label || '');
  const [editSublabel, setEditSubLabel] = useState(header.sublabel || '');
  const [editIcon, setEditIcon] = useState(header.icon || '');
  const [editInterest, setEditInterest] = useState(header.interest || false);
  const [editDisplayFrom, setEditDisplayFrom] = useState(header.displayFrom);
  const [editFromMonth, setEditDispFromM] = useState(header.displayFromMonth);
  const [editFromYear, setEditFromYear] = useState(header.displayFromYear);
  const [editDisplayTo, setEditDisplayTo] = useState(header.displayTo);
  const [editToMonth, setEditToMonth] = useState(header.displayToMonth);
  const [editToYear, setEditToYear] = useState(header.displayToYear);

  const editHeaderConfirm = () => {
    const newHelper = deepCopy(header);

    newHelper.label = editLabel;
    newHelper.sublabel = editSublabel;
    newHelper.icon = editIcon;
    newHelper.interest = editInterest;
    newHelper.displayFrom = editDisplayFrom;
    newHelper.displayFromMonth = editFromMonth;
    newHelper.displayFromYear = editFromYear;
    newHelper.displayTo = editDisplayTo;
    newHelper.displayToMonth = editToMonth;
    newHelper.displayToYear = editToYear;

    onUpdateSavingHeader(newHelper);
    setEdit(false);
  };

  const editHeaderCancel = () => {
    setEdit(false);
    setEditLabel(header.label || '');
    setEditSubLabel(header.sublabel || '');
    setEditIcon(header.icon || '');
    setEditInterest(header.interest || false);
    setEditDisplayFrom(header.displayFrom || false);
    setEditDispFromM(header.displayFromMonth);
    setEditFromYear(header.displayFromYear);
    setEditDisplayTo(header.displayTo || false);
    setEditToMonth(header.displayToMonth);
    setEditToYear(header.displayToYear);
  };

  const moveUpHeader = (index: number) => {
    if (index <= 0 || index >= bank.headers.savings.length) return;

    onSwitchSavingHeaders(index - 1, index);
  };

  const moveDownHeader = (index: number) => {
    if (index < 0 || index >= bank.headers.savings.length - 1) return;

    onSwitchSavingHeaders(index, index + 1);
  };

  if (!bankLoaded) {
    return null;
  }

  const displayDatesLabelFrom = labelMonth(
    (header.displayFromMonth || 1).toString(),
    header.displayFromYear ? header.displayFromYear.toString() : undefined,
    true
  );
  const displayDatesLabelTo = labelMonth(
    (header.displayToMonth || 1).toString(),
    header.displayToYear ? header.displayToYear.toString() : undefined,
    true
  );

  let displayDatesLabel = '-';

  if (header.displayFrom && header.displayTo) {
    displayDatesLabel = `From ${displayDatesLabelFrom} to ${displayDatesLabelTo}`;
  }
  if (header.displayFrom && !header.displayTo) {
    displayDatesLabel = `From ${displayDatesLabelFrom}`;
  }
  if (!header.displayFrom && header.displayTo) {
    displayDatesLabel = `Until ${displayDatesLabelTo}`;
  }

  return edit ? (
    <>
      {index > 0 && <hr />}
      <Row className="form-headers">
        <Col xs={12} sm={3}>
          <Label for="editLabel">Label</Label>
          <Input
            type="text"
            id="editLabel"
            name="editLabel"
            value={editLabel}
            onChange={event => setEditLabel(event.target.value)}
            className="form-control"
          />
        </Col>
        <Col xs={12} sm={3}>
          <Label for="editSublabel">Sub label</Label>
          <Input
            type="text"
            id="editSublabel"
            name="editSublabel"
            value={editSublabel}
            onChange={event => setEditSubLabel(event.target.value)}
            className="form-control"
          />
        </Col>
        <Col xs={12} sm={4}>
          <Label for="editIcon">Icon</Label>
          <Input
            type="text"
            id="editIcon"
            name="editIcon"
            value={editIcon}
            onChange={event => setEditIcon(event.target.value)}
            className="form-control"
          />
        </Col>
        <Col xs={12} sm={2}>
          <Label className="display-block">Interest</Label>
          <ButtonGroup className="d-flex">
            <Button
              color={editInterest ? 'primary' : 'light'}
              onClick={() => setEditInterest(true)}
            >
              Yes
            </Button>
            <Button
              color={editInterest ? 'light' : 'primary'}
              onClick={() => setEditInterest(false)}
            >
              No
            </Button>
          </ButtonGroup>
        </Col>

        <Col xs={4} sm={2}>
          <Label className="display-block">Display from</Label>
          <ButtonGroup className="d-flex">
            <Button
              outline={!editDisplayFrom}
              color="primary"
              onClick={() => setEditDisplayFrom(true)}
            >
              Yes
            </Button>
            <Button
              outline={editDisplayFrom}
              color="primary"
              onClick={() => setEditDisplayFrom(false)}
            >
              No
            </Button>
          </ButtonGroup>
        </Col>

        <Col xs={8} sm={4}>
          <Label>&nbsp;</Label>

          <InputGroup>
            <CustomInput
              type="select"
              id="firstMonth"
              value={editFromMonth || 0}
              onChange={e => setEditDispFromM(parseInt(e.target.value))}
              disabled={!editDisplayFrom}
            >
              {_.range(1, 13).map((m, key) => (
                <option value={m} key={key}>
                  {labelMonth(m.toString())}
                </option>
              ))}
            </CustomInput>
            <InputGroupAddon addonType="append">
              <CustomInput
                type="select"
                id="firstYear"
                value={editFromYear || 0}
                onChange={e => setEditFromYear(parseInt(e.target.value))}
                disabled={!editDisplayFrom}
              >
                {_.range(bank.headers.firstYear, currentYear + 1).map(
                  (y, key) => (
                    <option value={y} key={key}>
                      {y}
                    </option>
                  )
                )}
              </CustomInput>
            </InputGroupAddon>
          </InputGroup>
        </Col>

        <Col xs={4} sm={2}>
          <Label className="display-block">Display To</Label>
          <ButtonGroup className="d-flex">
            <Button
              outline={!editDisplayTo}
              color="primary"
              onClick={() => setEditDisplayTo(true)}
            >
              Yes
            </Button>
            <Button
              outline={editDisplayTo}
              color="primary"
              onClick={() => setEditDisplayTo(false)}
            >
              No
            </Button>
          </ButtonGroup>
        </Col>

        <Col xs={8} sm={4}>
          <Label>&nbsp;</Label>
          <InputGroup>
            <CustomInput
              type="select"
              id="firstMonth"
              value={editToMonth || 0}
              onChange={e => setEditToMonth(parseInt(e.target.value))}
              disabled={!editDisplayTo}
            >
              {_.range(1, 13).map((m, key) => (
                <option value={m} key={key}>
                  {labelMonth(m.toString())}
                </option>
              ))}
            </CustomInput>
            <InputGroupAddon addonType="append">
              <CustomInput
                type="select"
                id="firstYear"
                value={editToYear || 0}
                onChange={e => setEditToYear(parseInt(e.target.value))}
                disabled={!editDisplayTo}
              >
                {_.range(bank.headers.firstYear, currentYear + 1).map(
                  (y, key) => (
                    <option value={y} key={key}>
                      {y}
                    </option>
                  )
                )}
              </CustomInput>
            </InputGroupAddon>
          </InputGroup>
        </Col>

        <Col xs={12} className="text-right mt-3">
          <Button color="outline-primary" onClick={editHeaderCancel}>
            <Icon icon="times" className="mr-1" /> Cancel
          </Button>
          <Button color="primary" className="ml-3" onClick={editHeaderConfirm}>
            <Icon icon="check" className="mr-1" /> Confirm
          </Button>
        </Col>
      </Row>
      {index < bank.headers.savings.length - 1 && <hr />}
    </>
  ) : (
    <Row className="form-headers">
      <Col xs={12} sm={2}>
        <span className="label-fake-input">{header.label}</span>
      </Col>
      <Col xs={12} sm={2}>
        <span className="label-fake-input">{header.sublabel}</span>
      </Col>
      <Col xs={12} sm={1}>
        {header.icon ? (
          <img src={header.icon} alt="Institution" width="16" />
        ) : (
          <span>-</span>
        )}
      </Col>
      <Col xs={12} sm={3}>
        {displayDatesLabel}
      </Col>
      <Col xs={5} sm={2}>
        <Icon
          icon={['far', header.interest ? 'check-square' : 'square']}
          className="mr-2"
        />
        Interest
      </Col>
      <Col xs={7} sm={2} className="text-right">
        <span className="btn btn-link" onClick={() => setEdit(true)}>
          <Icon icon="edit" size="lg" />
        </span>
        <span
          className="btn btn-link"
          onClick={() => onDeleteSavingHeader(header)}
        >
          <Icon icon="trash-alt" size="lg" />
        </span>
        <span
          className={`btn btn-link ${index === 0 ? 'disabled' : ''}`}
          onClick={e => moveUpHeader(index)}
        >
          <Icon icon="chevron-up" size="lg" />
        </span>
        <span
          className={`btn btn-link ${
            index >= bank.headers.savings.length - 1 ? 'disabled' : ''
          }`}
          onClick={e => moveDownHeader(index)}
        >
          <Icon icon="chevron-down" size="lg" />
        </span>
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
    onUpdateSavingHeader: (header: ISavingsHeader) => {
      dispatch(updateSavingHeader(header));
    },
    onDeleteSavingHeader: (header: ISavingsHeader) => {
      dispatch(deleteSavingHeader(header));
    },
    onSwitchSavingHeaders: (index1: number, index2: number) => {
      dispatch(switchSavingHeaders(index1, index2));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Saving);
