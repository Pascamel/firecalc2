import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Alert, Col, Container, Row } from 'reactstrap';

import { loadBank, saveBank } from '../../actions';
import * as Bank from '../../bank';
import { LoadingPanel, SavePanel } from '../../components';
import Table from './table';

interface IProps {
  authUser: firebase.User|null,
  bank: Bank.IBank,
  bankLoaded: boolean,
  bankUpdated: boolean,
  saveInProgress: boolean,
  onLoadBank: (uid: string) => void,
  onSaveBank: (uid: string, bank: Bank.IBank) => void
}

class SavingsPageBase extends React.Component<IProps, {}> {
  componentDidMount() {
    const { authUser, onLoadBank, bankLoaded } = this.props;
    if (bankLoaded || !authUser ) return;
    
    onLoadBank(authUser.uid);
  }

  saveData = () => {
    if (!this.props.authUser) return;

    this.props.onSaveBank(this.props.authUser.uid, this.props.bank);
  }

  cancelChanges = () => {
    if (!this.props.authUser) return;

    this.props.onLoadBank(this.props.authUser.uid);
  }

  render() {
    const { bank, bankLoaded, bankUpdated, saveInProgress } = this.props;

    if (!bankLoaded) return <LoadingPanel />;
    
    return (
      <React.Fragment>
        <SavePanel label="Savings" 
                   saveClick={this.saveData} 
                   cancelChanges={this.cancelChanges}
                   {...this.state} />
        <Container fluid className="top-shadow">
          <Row>
            <Col className="pr-0 pl-0">
              <Container>
                <Row>
                  <Col>
                    <Alert color="background">
                      <Table />
                    </Alert>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => {
  return ({
    authUser: state.sessionState.authUser,
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded,
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SavingsPageBase);
