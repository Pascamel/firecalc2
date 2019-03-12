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
      <Container fluid className={`alert alert-save ${updated ? 'alert-warning' : 'alert-light'}`}>
        <Row>
          <Col>
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

                  {label !== 'Savings' && label !== 'Revenues' && label !== 'Settings' && 
                  <ButtonGroup className="pull-left">
                    <Button color={updated ? 'warning' : 'light'} onClick={this.props.prevMonth}>
                      <FontAwesomeIcon icon="backward" />
                    </Button>
                    <Button color={updated ? 'warning' : 'light'} onClick={this.props.nextMonth}>
                      <FontAwesomeIcon icon="forward" />
                    </Button>
                  </ButtonGroup>}                

                  {updated && <span>
                    <FontAwesomeIcon icon="exclamation-triangle" size="lg" className="mr-2" />
                    Updates have been detected. Save now!
                  </span>}
                  {!updated && <span className="title">
                    {label}
                  </span>}

                  <button className={`btn btn-save pull-right ${updated ? 'btn-warning' : 'btn-light'}`} onClick={saveClick}>
                    {!saveInProgress && <FontAwesomeIcon icon={['far', 'save']} className="mr-1" />}
                    {saveInProgress && <FontAwesomeIcon icon="spinner" className="mr-1" spin />}
                    {saveInProgress ? 'Saving' : 'Save'}
                  </button>

                  {updated && <button className="btn btn-warning pull-right" onClick={cancelChanges}>
                    <FontAwesomeIcon icon="times" /> Cancel
                  </button>}
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
} 
