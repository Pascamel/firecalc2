import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';

import { deleteSavingHeader, switchSavingHeaders, updateSavingHeader } from '../../actions';
import Bank, { ISavingsHeader } from '../../bank';
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

interface IState {
  edit: boolean;
  editLabel: string;
  editSublabel: string;
  editIcon: string;
  editInterest: boolean;
}

function Saving(props: IProps) {
  const { index, header, bank, bankLoaded, onUpdateSavingHeader, onDeleteSavingHeader, onSwitchSavingHeaders } = props;
  const [edit, setEdit] = useState(false);
  const [editLabel, setEditLabel] = useState(header.label || '');
  const [editSublabel, setEditSubLabel] = useState(header.sublabel || '');
  const [editIcon, setEditIcon] = useState(header.icon || '');
  const [editInterest, setEditInterest] = useState(header.interest || false);
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'editLabel') setEditLabel(event.target.value);
    if (event.target.name === 'editSublabel') setEditSubLabel(event.target.value);
    if (event.target.name === 'editIcon') setEditIcon(event.target.value);
    if (event.target.name === 'editInterest') setEditInterest(event.target.checked);
  }

  const editHeader = () => {
    setEdit(true);
  }

  const editHeaderConfirm = () => {
    header.label = editLabel;
    header.sublabel = editSublabel;
    header.icon = editIcon;
    header.interest = editInterest;

    onUpdateSavingHeader(header);
    setEdit(false);
  }

  const editHeaderCancel = () => {
    setEdit(false);
    setEditLabel(header.label || '');
    setEditSubLabel(header.sublabel || '');
    setEditIcon(header.icon || '');
    setEditInterest(header.interest || false);
  }

  const removeHeader = () => {
    onDeleteSavingHeader(header);
  }

  const moveUpHeader = (index: number) => {
    if (index <= 0 || index >= bank.headers.savings.length) return;	

    onSwitchSavingHeaders(index-1, index);
  }

  const moveDownHeader = (index: number) => {
    if (index < 0 || index >= bank.headers.savings.length - 1) return;

    onSwitchSavingHeaders(index, index+1);
  }

  if (!bankLoaded) return null;

  return (
    <Row className="form-headers">
      <Col xs={12} sm={2}>
        {!edit && <span className="label-fake-input">
          {header.label}
        </span>}
        {edit && <input
          type="text"
          name="editLabel"
          value={editLabel} 
          onChange={handleInputChange} 
          className="form-control" 
        />}
      </Col>
      <Col xs={12} sm={2}>
        {!edit && <span className="label-fake-input">
          {header.sublabel}
        </span>}
        {edit && <input
          type="text"
          name="editSublabel"
          value={editSublabel} 
          onChange={handleInputChange} 
          className="form-control" 
        />}
      </Col>
      <Col xs={12} sm={4}>
        {!edit && <span className="label-fake-input nowrap-ellipsis">
          {header.icon}
        </span>}
        {edit && <input
          type="text"       
          name="editIcon"
          value={editIcon} 
          onChange={handleInputChange} 
          className="form-control" 
        />}
      </Col>
      <Col xs={5} sm={2}>
        <div className="checkbox">
          {!edit && <FontAwesomeIcon icon={['far', header.interest?'check-square':'square']} className="mr-1" />}
          <label>
            {edit && <input
              type="checkbox" 
              name="editInterest" 
              checked={editInterest} 
              onChange={handleInputChange} 
            />} Interest
          </label>
        </div>
      </Col>
      <Col xs={7} sm={2} className="text-right">
        {edit && <span className="btn btn-link" onClick={editHeaderConfirm}>
          <FontAwesomeIcon icon="check" size="lg" />
        </span>}
        {edit && <span className="btn btn-link" onClick={editHeaderCancel}>
          <FontAwesomeIcon icon="times" size="lg" />
        </span>}
        {!edit && <span className="btn btn-link" onClick={editHeader}>
          <FontAwesomeIcon icon="edit" size="lg" />
        </span>}
        {!edit && <span className="btn btn-link" onClick={removeHeader}>
          <FontAwesomeIcon icon="trash-alt" size="lg" />
        </span>}
        {!edit && <span className={`btn btn-link ${(index === 0) ? 'disabled' : ''}`} onClick={e => moveUpHeader(index)}>
          <FontAwesomeIcon icon="chevron-up" size="lg" />
        </span>}
        {!edit && <span className={`btn btn-link ${(index >= bank.headers.savings.length-1) ? 'disabled' : ''}`} onClick={e => moveDownHeader(index)}>
          <FontAwesomeIcon icon="chevron-down" size="lg" />
        </span>}
      </Col>
    </Row>
  );
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded
  });
}

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

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Saving);