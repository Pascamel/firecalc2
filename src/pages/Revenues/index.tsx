import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { compose } from 'recompose';

import Table from './table';
import { LoadingPanel } from '../../components/LoadingPanel';
import { SavePanel } from '../../components/SavePanel';
// import ErrorPanel from '../UI/ErrorPanel';
import { Bank } from '../../bank';
import { AuthUserContext } from '../../firebase/AuthUserContext';
import { withAuthorization } from '../../firebase/withAuthorization';


interface IProps {

}

interface IState {
  bank: Bank,
  loading: boolean,
  updated: boolean,
  saveInProgress: boolean
}

class RevenuePageBase extends Component<IProps, IState> {
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

  render() {
    const { loading, updated } = this.state;

    
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <React.Fragment>
            {loading && <LoadingPanel />}
            {!loading && <SavePanel label="Revenues" updated={updated} saveClick={this.saveData} callback={this.updateValue} {...this.state} />}
            {!loading && <Container>
              <Row>
                <Col>
                  <Table {...this.state} callback={this.updateValue} />
                </Col>
              </Row>
            </Container>}
          </React.Fragment>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const authCondition = (authUser: firebase.User) => !!authUser;

export const RevenuesPage = withAuthorization(authCondition)(RevenuePageBase);
