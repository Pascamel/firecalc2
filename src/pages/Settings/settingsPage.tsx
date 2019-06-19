import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import { loadBank, saveHeaders, updateValue } from '../../actions';
import Bank from '../../bank';
import { LoadingPanel, SavePanel } from '../../components';
import { AppState } from '../../store';
import Incomes from './incomes';
import Savings from './savings';
import StartingPoint from './startingPoint';

interface IProps {
  authUser: firebase.User|null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  onLoadBank: (uid: string) => void;
  onUpdateValue: (index: string, indexes: string[], amount: number|boolean) => void;
  onSaveBank: (uid: string, bank: Bank.IBank) => void;
}

class SettingsPageBase extends React.Component<IProps, {}> {
  default_headers = {
    savings: [],
    incomes: [],
    startingCapital: 0
  }

  componentDidMount() {
    const { authUser, onLoadBank, bankLoaded } = this.props;
    if (bankLoaded || !authUser ) return;
    
    onLoadBank(authUser.uid);
  }

  cancelChanges = () => {
    if (!this.props.authUser) return;

    this.props.onLoadBank(this.props.authUser.uid);
  }

  saveHeaders = () => {
    if (!this.props.authUser) return;

    this.props.onSaveBank(this.props.authUser.uid, this.props.bank);
  }

  render() {
    const { bankLoaded } = this.props;

    if (!bankLoaded) return <LoadingPanel />;

    return (
      <React.Fragment>
        <SavePanel label="Settings" />
        <Container fluid className="top-shadow">
          <Row>
            <Col className="pl-0 pr-0">
              <Container>
                <StartingPoint /> 
                <Savings /> 
                <Incomes /> 
              </Container>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return ({
    authUser: state.sessionState.authUser,
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onLoadBank: (uid: string) => {
      dispatch(loadBank(uid));
    },
    onUpdateValue: (index: string, indexes: string[], amount: number|boolean) => {
      dispatch(updateValue(index, indexes, amount));
    },
    onSaveBank: (uid: string, bank: Bank.IBank) => {
      dispatch(saveHeaders(uid, bank));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPageBase);
