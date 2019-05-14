import React from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';
import { LoadingPanel, SavePanel } from '../../components';
import * as Bank from '../../bank';
import Table from './table';


interface IProps {}

interface IState {
  bank: Bank.IBank,
  loading: boolean,
  updated: boolean,
  saveInProgress: boolean
}

export default class RevenuePageBase extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      loading: true,
      updated: false,
      saveInProgress: false,
      bank: ({} as Bank.IBank)
    };
  }

  componentDidMount() {
    Bank.load('123').then(() => {
      this.setState({bank: this.state.bank, loading: false});
    }).catch(function(error) {});
  }

  updateValue = (index: string, indexes: string[], amount: number, updatedState: boolean) => {  
    Bank.updateValue(this.state.bank, index, indexes, amount);
    if (updatedState) {
      this.setState({bank: this.state.bank, updated: true});
    } else {
      this.setState({bank: this.state.bank});
      Bank.saveLocalStorage(this.state.bank);
    }
  }

  saveData = () => {
    this.setState({saveInProgress: true});

    Bank.saveIncome('123', this.state.bank).then(() => {
      this.setState({
        updated: false, 
        saveInProgress: false
      });
    }).catch((error) => {});
  }

  cancelChanges = () => {
    Bank.load('123').then(() => {
      this.setState({
        updated: false,
        bank: this.state.bank
      });
    });
  }

  render() {
    const { loading, updated } = this.state;
    
    return (
      <React.Fragment>
        {loading && <LoadingPanel />}
        {!loading && <SavePanel label="Revenues" 
                                updated={updated} 
                                saveClick={this.saveData} 
                                cancelChanges={this.cancelChanges}
                                callback={this.updateValue} 
                                {...this.state} />}
        {!loading && <Container fluid className="top-shadow">
          <Row>
            <Col className="pr-0 pl-0">
              <Container>
                <Row>
                  <Col>
                    <Alert color="background">
                      <Table {...this.state} callback={this.updateValue} />
                    </Alert>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>}
      </React.Fragment>
    );
  }
}
