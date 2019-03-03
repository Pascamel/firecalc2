import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
// import { compose } from 'recompose';

import Table from './table';
import { LoadingPanel } from '../../components/LoadingPanel';
import { SavePanel } from '../../components/SavePanel';
// import ErrorPanel from '../UI/ErrorPanel';
import { Bank } from '../../bank';
import { AuthUserContext } from '../../firebase/AuthUserContext';
import { withAuthorization } from '../../firebase/withAuthorization';

interface IProps {}

interface IState {
  loading: boolean,
  updated: boolean,
  saveInProgress: boolean,
  bank: Bank
}

class SavingsPageBase extends Component<IProps, IState> {
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

  render() {
    const { loading, updated } = this.state;

    
    return (
      <React.Fragment>
        {loading && <LoadingPanel />}
        {!loading && <SavePanel label="Savings" updated={updated} saveClick={this.saveData} callback={this.updateValue} {...this.state} />}
        {!loading && <Container>
          <Row>
            <Col>
              <Table {...this.state} callback={this.updateValue} />
            </Col>
          </Row>
        </Container>}
      </React.Fragment>
    );
  }
}

const authCondition = (authUser: firebase.User) => !!authUser;

export const SavingsPage = withAuthorization(authCondition)(SavingsPageBase);
