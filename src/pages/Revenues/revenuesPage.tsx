import React from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';
import LoadingPanel from '../../components/LoadingPanel';
import SavePanel from '../../components/SavePanel';
import { Bank } from '../../bank';
import Table from './table';


interface IProps {}

interface IState {
  bank: Bank,
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
      bank: new Bank()
    };
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

    this.state.bank.saveIncome().then(() => {
      this.setState({
        updated: false, 
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
        {!loading && <SavePanel label="Revenues" 
                                updated={updated} 
                                saveClick={this.saveData} 
                                cancelChanges={this.cancelChanges}
                                callback={this.updateValue} 
                                {...this.state} />}
        {!loading && <Container fluid className="top-shadow">
          <Row>
            <Col>
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
