import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Col, Container, Row } from 'reactstrap';

import { loadBank, saveBank, saveHeaders } from '../actions';
import Bank from '../bank';
import { AppState } from '../store';
import DecimalsBtn from './DecimalsBtn';
import FiltersBtn from './FiltersBtn';

interface IProps {
  authUser: firebase.User;
  label: string;
  bankUpdated: boolean;
  saveInProgress: boolean;
  bank: Bank.IBank;
  prevMonth?: () => void;
  nextMonth?: () => void;
  onLoadBank: (uid: string) => void;
  onSaveBank: (uid: string, bank: Bank.IBank) => void;
  onSaveHeaders: (uid: string, bank: Bank.IBank) => void;
}

class SavePanel extends React.Component<IProps, {}> {

  cancelClick() {
    if (!this.props.authUser) return;

    this.props.onLoadBank(this.props.authUser.uid);
  }

  saveClick() {
    if (!this.props.authUser) return;

    if (this.props.label === 'Settings') {
      this.props.onSaveHeaders(this.props.authUser.uid, this.props.bank);
    } else {
      this.props.onSaveBank(this.props.authUser.uid, this.props.bank);
    }
  }

  render() {
    const { bankUpdated, saveInProgress, label } = this.props;

    return (
      <Container fluid className="alert alert-save alert-header">
        <Row>
          <Col className="pr-0 pl-0">
            <Container>
              <Row>
                <Col className="text-center">
                
                  {label === 'Savings' && <ButtonGroup className="pull-left">
                    <FiltersBtn />
                    <DecimalsBtn />
                  </ButtonGroup>}

                  {label === 'Revenues' && <ButtonGroup className="pull-left">
                    <DecimalsBtn />
                  </ButtonGroup>}

                  {['Savings', 'Revenues', 'Settings'].indexOf(label) === -1 && 
                  <ButtonGroup className="pull-left">
                    <Button color="outline-light" onClick={this.props.prevMonth}>
                      <FontAwesomeIcon icon="backward" />
                    </Button>
                    <Button color="outline-light" onClick={this.props.nextMonth}>
                      <FontAwesomeIcon icon="forward" />
                    </Button>
                  </ButtonGroup>}

                  <span className={`title nowrap-ellipsis ${bankUpdated ? 'text-warning' : ''}`}>
                    {label}
                  </span>

                  <Button color={bankUpdated ? 'header' : 'outline-light'} className="btn-save" onClick={() => this.saveClick()}>
                    {!saveInProgress && <FontAwesomeIcon icon={['far', 'save']} className="mr-1" />}
                    {saveInProgress && <FontAwesomeIcon icon="spinner" className="mr-1" spin />}
                    {saveInProgress ? 'Saving' : 'Save'}
                  </Button>

                  {bankUpdated && !saveInProgress && <Button color="header" className="btn-cancel" onClick={() => this.cancelClick()}>
                    <FontAwesomeIcon icon="times" /> Cancel
                  </Button>}
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
} 

const mapStateToProps = (state: AppState) => {
  return ({
    authUser: state.sessionState.authUser,
    bank: state.bankState.bank,
    bankUpdated: state.bankState.bankUpdated,
    saveInProgress: state.bankState.saveInProgress
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onLoadBank: (uid: string) => {
      dispatch(loadBank(uid));
    },
    onSaveBank: (uid: string, bank: Bank.IBank) => {
      dispatch(saveBank(uid, bank));
    },
    onSaveHeaders: (uid: string, bank: Bank.IBank) => {
      dispatch(saveHeaders(uid, bank));
    }
  };
};

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(SavePanel);