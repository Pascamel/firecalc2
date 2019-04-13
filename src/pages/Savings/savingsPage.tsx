import React from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';
import { Bank } from '../../bank';
import Table from './table';
import { LoadingPanel, SavePanel } from '../../components';


interface IProps {}

interface IState {
  loading: boolean,
  updated: boolean,
  saveInProgress: boolean,
  bank: Bank
}

export default class SavingsPageBase extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      loading: true,
      updated: false,
      saveInProgress: false,
      bank: new Bank()
    }
  }

  componentDidMount() {
    this.state.bank.load().then(() => {
      this.setState({bank: this.state.bank, loading: false});
    }).catch(function(error) {});
  }

  updateValue = (index: string, indexes: string[], amount: number, updatedState: boolean) => {
    this.state.bank.updateValue(index, indexes, amount);
    if (updatedState) {
      this.setState({bank: this.state.bank, updated: true});
    } else {
      this.setState({bank: this.state.bank});
      this.state.bank.saveLocalStorage();
    }
  }

  saveData = () => {
    this.setState({saveInProgress: true});

    this.state.bank.saveSavings().then((saved) => {
      this.setState({
        updated: !saved, 
        saveInProgress: false
      });
    }).catch((error) => {});
  }

  cancelChanges = () => {
    this.state.bank.load().then(() => {
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
        {!loading && <SavePanel label="Savings" 
                                updated={updated} 
                                saveClick={this.saveData} 
                                cancelChanges={this.cancelChanges}
                                callback={this.updateValue} 
                                {...this.state} />}
        {!loading &&  <Container fluid className="top-shadow">
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
