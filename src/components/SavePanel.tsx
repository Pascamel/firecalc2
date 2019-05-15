import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Col, Container, Row } from 'reactstrap';

import * as Bank from '../bank';
import DecimalsBtn from './DecimalsBtn';
import FiltersBtn from './FiltersBtn';

interface IProps {
  label: string,
  bankUpdated: boolean, 
  saveInProgress: boolean, 
  bank: Bank.IBank,
  saveClick: () => void,
  cancelChanges: () => void,
  prevMonth?: () => void,
  nextMonth?: () => void,
  callback?: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

class SavePanel extends React.Component<IProps, {}> {

  saveClick
  render() {
    const { bankUpdated, saveInProgress, label, saveClick, cancelChanges } = this.props;

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

                  <Button color={bankUpdated ? 'header' : 'outline-light'} className="btn-save" onClick={saveClick}>
                    {!saveInProgress && <FontAwesomeIcon icon={['far', 'save']} className="mr-1" />}
                    {saveInProgress && <FontAwesomeIcon icon="spinner" className="mr-1" spin />}
                    {saveInProgress ? 'Saving' : 'Save'}
                  </Button>

                  {bankUpdated && !saveInProgress && <Button color="header" className="btn-cancel" onClick={cancelChanges}>
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

const mapStateToProps = (state: any) => {
  return ({
    bank: state.bankState.bank,
    bankUpdated: state.bankState.bankUpdated,
    saveInProgress: state.bankState.saveInProgress
  });
}

export default connect(mapStateToProps)(SavePanel);