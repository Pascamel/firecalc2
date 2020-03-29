import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Col,
  CustomInput,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Row
} from 'reactstrap';
import ButtonGroup from 'reactstrap/lib/ButtonGroup';

import {
  deleteSavingHeader,
  switchSavingHeaders,
  updateSavingHeader
} from '../../actions';
import Bank, { ISavingsHeader } from '../../bank';
import helpers from '../../helpers';
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

const Saving = (props: IProps) => {
  const {
    index,
    header,
    bank,
    bankLoaded,
    onUpdateSavingHeader,
    onDeleteSavingHeader,
    onSwitchSavingHeaders
  } = props;
  const currentYear = new Date().getFullYear();
  const [edit, setEdit] = useState(false);
  const [editLabel, setEditLabel] = useState(header.label || '');
  const [editSublabel, setEditSubLabel] = useState(header.sublabel || '');
  const [editIcon, setEditIcon] = useState(header.icon || '');
  const [editInterest, setEditInterest] = useState(header.interest || false);
  const [editDisplayFrom, setEditDisplayFrom] = useState(
    header.displayFrom || false
  );
  const [editDisplayFromMonth, setEditDisplayFromMonth] = useState(
    header.displayFromMonth
  );
  const [editDisplayFromYear, setEditDisplayFromYear] = useState(
    header.displayFromYear
  );
  const [editDisplayTo, setEditDisplayTo] = useState(header.displayTo || false);
  const [editDisplayToMonth, setEditDisplayToMonth] = useState(
    header.displayToMonth
  );
  const [editDisplayToYear, setEditDisplayToYear] = useState(
    header.displayToYear
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'editLabel') setEditLabel(event.target.value);
    if (event.target.name === 'editSublabel')
      setEditSubLabel(event.target.value);
    if (event.target.name === 'editIcon') setEditIcon(event.target.value);
    if (event.target.name === 'editInterest')
      setEditInterest(event.target.checked);
  };

  const editHeader = () => {
    setEdit(true);
  };

  const editHeaderConfirm = () => {
    header.label = editLabel;
    header.sublabel = editSublabel;
    header.icon = editIcon;
    header.interest = editInterest;
    header.displayFrom = editDisplayFrom;
    header.displayFromMonth = editDisplayFromMonth;
    header.displayFromYear = editDisplayFromYear;
    header.displayTo = editDisplayTo;
    header.displayToMonth = editDisplayToMonth;
    header.displayToYear = editDisplayToYear;

    onUpdateSavingHeader(header);
    setEdit(false);
  };

  const editHeaderCancel = () => {
    setEdit(false);
    setEditLabel(header.label || '');
    setEditSubLabel(header.sublabel || '');
    setEditIcon(header.icon || '');
    setEditInterest(header.interest || false);
    setEditDisplayFrom(header.displayFrom || false);
    setEditDisplayFromMonth(header.displayFromMonth);
    setEditDisplayFromYear(header.displayFromYear);
    setEditDisplayTo(header.displayTo || false);
    setEditDisplayToMonth(header.displayToMonth);
    setEditDisplayToYear(header.displayToYear);
  };

  const removeHeader = () => {
    onDeleteSavingHeader(header);
  };

  const moveUpHeader = (index: number) => {
    if (index <= 0 || index >= bank.headers.savings.length) return;

    onSwitchSavingHeaders(index - 1, index);
  };

  const moveDownHeader = (index: number) => {
    if (index < 0 || index >= bank.headers.savings.length - 1) return;

    onSwitchSavingHeaders(index, index + 1);
  };

  if (!bankLoaded) return null;

  const displayDatesLabelFrom = helpers.labelMonth(
    (header.displayFromMonth || 1).toString(),
    header.displayFromYear ? header.displayFromYear.toString() : undefined,
    true
  );
  const displayDatesLabelTo = helpers.labelMonth(
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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

        <Col xs={12} sm={6}>
          <Label>Display from</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <Button
                color={editDisplayFrom ? 'primary' : 'light'}
                onClick={() => setEditDisplayFrom(true)}
              >
                Yes
              </Button>
              <Button
                color={editDisplayFrom ? 'light' : 'primary'}
                onClick={() => setEditDisplayFrom(false)}
              >
                No
              </Button>
            </InputGroupAddon>

            <CustomInput
              type="select"
              id="firstMonth"
              value={editDisplayFromMonth || 0}
              onChange={e => setEditDisplayFromMonth(parseInt(e.target.value))}
              disabled={!editDisplayFrom}
            >
              {_.range(1, 13).map((m, key) => (
                <option value={m} key={key}>
                  {helpers.labelMonth(m.toString())}
                </option>
              ))}
            </CustomInput>

            <CustomInput
              type="select"
              id="firstYear"
              value={editDisplayFromYear || 0}
              onChange={e => setEditDisplayFromYear(parseInt(e.target.value))}
              disabled={!editDisplayFrom}
            >
              {_.range(
                //currentYear - 10,
                bank.headers.firstYear,
                currentYear + 1
              ).map((y, key) => (
                <option value={y} key={key}>
                  {y}
                </option>
              ))}
            </CustomInput>
          </InputGroup>
        </Col>

        <Col xs={12} sm={6}>
          <Label>Display To</Label>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <Button
                color={editDisplayTo ? 'primary' : 'light'}
                onClick={() => setEditDisplayTo(true)}
              >
                Yes
              </Button>
              <Button
                color={editDisplayTo ? 'light' : 'primary'}
                onClick={() => setEditDisplayTo(false)}
              >
                No
              </Button>
            </InputGroupAddon>

            <CustomInput
              type="select"
              id="firstMonth"
              value={editDisplayToMonth || 0}
              onChange={e => setEditDisplayToMonth(parseInt(e.target.value))}
              disabled={!editDisplayTo}
            >
              {_.range(1, 13).map((m, key) => (
                <option value={m} key={key}>
                  {helpers.labelMonth(m.toString())}
                </option>
              ))}
            </CustomInput>

            <CustomInput
              type="select"
              id="firstYear"
              value={editDisplayToYear || 0}
              onChange={e => setEditDisplayToYear(parseInt(e.target.value))}
              disabled={!editDisplayTo}
            >
              {_.range(
                //currentYear - 10,
                bank.headers.firstYear,
                currentYear + 1
              ).map((y, key) => (
                <option value={y} key={key}>
                  {y}
                </option>
              ))}
            </CustomInput>
          </InputGroup>
        </Col>

        <Col xs={12} className="text-right mt-3">
          <Button color="outline-primary" onClick={editHeaderCancel}>
            <FontAwesomeIcon icon="times" className="mr-1" /> Cancel
          </Button>
          <Button color="primary" className="ml-3" onClick={editHeaderConfirm}>
            <FontAwesomeIcon icon="check" className="mr-1" /> Confirm
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
        {header.icon && <img src={header.icon} alt="Institution" width="16" />}
        {/* <span className="label-fake-input nowrap-ellipsis">{header.icon}</span> */}
      </Col>
      <Col xs={12} sm={3}>
        {displayDatesLabel}
      </Col>
      <Col xs={5} sm={2}>
        <div className="checkbox">
          <FontAwesomeIcon
            icon={['far', header.interest ? 'check-square' : 'square']}
            className="mr-1"
          />{' '}
          <label>Interest</label>
        </div>
      </Col>
      <Col xs={7} sm={2} className="text-right">
        <span className="btn btn-link" onClick={editHeader}>
          <FontAwesomeIcon icon="edit" size="lg" />
        </span>
        <span className="btn btn-link" onClick={removeHeader}>
          <FontAwesomeIcon icon="trash-alt" size="lg" />
        </span>
        <span
          className={`btn btn-link ${index === 0 ? 'disabled' : ''}`}
          onClick={e => moveUpHeader(index)}
        >
          <FontAwesomeIcon icon="chevron-up" size="lg" />
        </span>
        <span
          className={`btn btn-link ${
            index >= bank.headers.savings.length - 1 ? 'disabled' : ''
          }`}
          onClick={e => moveDownHeader(index)}
        >
          <FontAwesomeIcon icon="chevron-down" size="lg" />
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
