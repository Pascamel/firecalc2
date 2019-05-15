import React from 'react';
import { connect } from 'react-redux';
import { loadBank, updateValue, saveHeaders } from '../../actions';
import { Container, Row, Col } from 'reactstrap';
import _ from 'lodash';
import * as Bank from '../../bank';
import { LoadingPanel, SavePanel } from '../../components';
import StartingPoint from './startingPoint';
import Savings from './savings';
import Incomes from './incomes';


interface IProps {
  authUser: firebase.User|null,
  bank: Bank.IBank,
  bankLoaded: boolean,
  bankUpdated: boolean,
  saveInProgress: boolean,
  onLoadBank: (uid: string) => void,
  onUpdateValue: (bank: Bank.IBank, index: string, indexes: string[], amount: number|boolean) => void,
  onSaveBank: (uid: string, bank: Bank.IBank) => void
}

class SettingsPageBase extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  default_headers = {
    savings: [],
    incomes: [],
    startingCapital: 0
  }

  componentDidMount () {
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

  render () {
    const { bank, bankLoaded, bankUpdated, saveInProgress } = this.props;

    if (!bankLoaded) return <LoadingPanel />;

    return (
      <React.Fragment>
        <SavePanel label="Settings" 
                   bank={bank}
                   updated={bankUpdated}
                   saveInProgress={saveInProgress}
                   cancelChanges={this.cancelChanges}
                   callback={() => {}} 
                   saveClick={this.saveHeaders} />
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

const mapStateToProps = (state: any) => {
  return ({
    authUser: state.sessionState.authUser,
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded,
    bankUpdated: state.bankState.bankUpdated,
    saveInProgress: state.bankState.saveInProgress
  });
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onLoadBank: (uid: string) => {
      dispatch(loadBank(uid));
    },
    onUpdateValue: (bank: Bank.IBank, index: string, indexes: string[], amount: number|boolean) => {
      dispatch(updateValue(bank, index, indexes, amount));
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
