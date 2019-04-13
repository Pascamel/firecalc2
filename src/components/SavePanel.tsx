import React from 'react';
import { Row, Col, Container, ButtonGroup, Button } from 'reactstrap';
import { FiltersBtn } from './FiltersBtn';
import DecimalsBtn from './DecimalsBtn';
import { Bank } from '../bank';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface IProps {
  updated: boolean, 
  saveInProgress: boolean, 
  label: string, 
  bank: Bank,
  saveClick: () => void,
  cancelChanges: () => void,
  prevMonth?: () => void,
  nextMonth?: () => void,
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

export default class SavePanel extends React.Component<IProps, {}> {
  render() {
    const { updated, saveInProgress, label, saveClick, cancelChanges } = this.props;

    return (
      <Container fluid className="alert alert-save alert-header">
        <Row>
          <Col className="pr-0 pl-0">
            <Container>
              <Row>
                <Col className="text-center">
                
                  {label === 'Savings' && <ButtonGroup className="pull-left">
                    <FiltersBtn {...this.props} />
                    <DecimalsBtn {...this.props} />
                  </ButtonGroup>}

                  {label === 'Revenues' && <ButtonGroup className="pull-left">
                    <DecimalsBtn {...this.props} />
                  </ButtonGroup>}

                  {['Savings', 'Revenues', 'Settings'].indexOf(label) === -1 && 
                  <ButtonGroup className="pull-left">
                    <Button color="header" onClick={this.props.prevMonth}>
                      <FontAwesomeIcon icon="backward" />
                    </Button>
                    <Button color="header" onClick={this.props.nextMonth}>
                      <FontAwesomeIcon icon="forward" />
                    </Button>
                  </ButtonGroup>}

                  {updated && <span className="title">
                    <FontAwesomeIcon icon="exclamation-triangle" className="mr-2" />
                    Updates have been detected. Save now!
                  </span>}

                  {!updated && <span className="title nowrap-ellipsis">
                    {label}
                  </span>}

                  <Button color="header" className="pull-right" onClick={saveClick}>
                    {!saveInProgress && <FontAwesomeIcon icon={['far', 'save']} className="mr-1" />}
                    {saveInProgress && <FontAwesomeIcon icon="spinner" className="mr-1" spin />}
                    {saveInProgress ? 'Saving' : 'Save'}
                  </Button>

                  {updated && <Button color="header" className="pull-right mr-2" onClick={cancelChanges}>
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
