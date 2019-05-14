import React from 'react';
import { connect } from 'react-redux';
import { loadBank, updateValue, saveHeaders } from '../../actions';
import { Container, Row, Col } from 'reactstrap';
import _ from 'lodash';
import uuid from 'uuid';
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

interface IState {
  headers: any
}

class SettingsPageBase extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      headers: this.default_headers
    };
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

  callbacks = {
    editHeaderCallback: (type: string, header: any) => {
      this.props.onUpdateValue(this.props.bank, 'headers', [type, header.id, '$edit'], true);
    },

    confirmEditHeaderCallback: (type: string, header: any) => {
      this.props.onUpdateValue(this.props.bank, 'headers', [type, header.id, '$edit'], false);
      // _.each(this.state.bank.headers[type], (h) => {
    },

    cancelEditHeaderCallback: (type: string, header: any) => {
      this.props.onUpdateValue(this.props.bank, 'headers', [type, header.id, '$edit'], false);
    },

    deleteHeaderCallback: (type: string, header: any) => {
      // _.remove(this.state.bank.headers[type], (h: any) => h.id === header.id);
    },

    moveUpHeaderCallback: (type: string, index: number) => {
      // if (index <= 0 || index >= this.state.bank.headers[type].length) return;

      // var tmp = this.state.bank.headers[type][index-1];
      // this.state.bank.headers[type][index-1] = this.state.bank.headers[type][index];
      // this.state.bank.headers[type][index] = tmp;

      // this.setState({bank: this.state.bank, updated: true});
    },
  
    moveDownHeaderCallback: (type: string, index: number) => {
      // if (index < 0 || index >= this.state.bank.headers[type].length - 1) return;

      // var tmp = this.state.bank.headers[type][index+1];
      // this.state.bank.headers[type][index+1] = this.state.bank.headers[type][index];
      // this.state.bank.headers[type][index] = tmp;

      // this.setState({bank: this.state.bank, updated: true});
    },

    updateCallback: (indexes: string[], value: number) => {
      let index = indexes.shift();
      if (!index) return;

      this.props.onUpdateValue(this.props.bank, index, indexes, value);
    },

    addHeaderCallback: (type: string) => {
      // let new_headers = JSON.parse(JSON.stringify(this.state.headers));
      // this.state.bank.headers[type].push({
      //   $edit: true,
      //   id: uuid.v4()
      // });
  
      // this.setState({bank: this.state.bank, updated: true});
    }
  };
  
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
                <StartingPoint bank={bank} {...this.state} {...this.callbacks} /> 
                <Savings bank={bank} {...this.state} {...this.callbacks} /> 
                <Incomes bank={bank} {...this.state} {...this.callbacks} /> 
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
