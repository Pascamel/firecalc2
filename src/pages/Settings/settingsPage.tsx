import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import _ from 'lodash';
import uuid from 'uuid';
import * as Bank from '../../bank';
import { LoadingPanel, SavePanel } from '../../components';
import StartingPoint from './startingPoint';
import Savings from './savings';
import Incomes from './incomes';


interface IState {
  bank: Bank.IBank,
  loading: boolean,
  updated: boolean,
  saveInProgress: boolean,
  headers: any
}

export default class SettingsPageBase extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      bank: ({} as Bank.IBank),
      loading: true,
      updated: false,
      saveInProgress: false,
      headers: this.default_headers
    };
  }

  default_headers = {
    savings: [],
    incomes: [],
    startingCapital: 0
  }

  componentDidMount () {
    Bank.load('123').then((b) => {
      this.setState({
        bank: b,
        loading: false});
    });
  }

  cancelChanges = () => {
    Bank.load('123').then((b) => {
      this.setState({
        updated: false,
        bank: b
      });
    });
  }

  saveHeaders = () => {
    this.setState({saveInProgress: true});

    Bank.saveHeaders(this.state.bank).then((saved: boolean) => {
      this.setState({
        updated: !saved, 
        saveInProgress: false
      });
    });
  }

  callbacks = {
    editHeaderCallback: (type: string, header: any) => {
      _.each(this.state.bank.headers[type], (h) => {
        if (h.id !== header.id) return;
        h.$edit = true;
      });

      this.setState({bank: this.state.bank});
    },

    confirmEditHeaderCallback: (type: string, header: any) => {
      _.each(this.state.bank.headers[type], (h) => {
        if (h.id !== header.id) return;
        h.$edit = false;
      });

      this.setState({bank: this.state.bank, updated: true});
    },

    cancelEditHeaderCallback: (type: string, header: any) => {
      _.each(this.state.bank.headers[type], (h) => {
        if (h.id !== header.id) return;
        h.$edit = false;
      });

      this.setState({bank: this.state.bank});
    },

    deleteHeaderCallback: (type: string, header: any) => {
      _.remove(this.state.bank.headers[type], (h: any) => h.id === header.id);

      this.setState({bank: this.state.bank, updated: true});
    },

    moveUpHeaderCallback: (type: string, index: number) => {
      if (index <= 0 || index >= this.state.bank.headers[type].length) return;

      var tmp = this.state.bank.headers[type][index-1];
      this.state.bank.headers[type][index-1] = this.state.bank.headers[type][index];
      this.state.bank.headers[type][index] = tmp;

      this.setState({bank: this.state.bank, updated: true});
    },
  
    moveDownHeaderCallback: (type: string, index: number) => {
      if (index < 0 || index >= this.state.bank.headers[type].length - 1) return;

      var tmp = this.state.bank.headers[type][index+1];
      this.state.bank.headers[type][index+1] = this.state.bank.headers[type][index];
      this.state.bank.headers[type][index] = tmp;

      this.setState({bank: this.state.bank, updated: true});
    },

    updateCallback: (indexes: string[], value: number) => {
      let index = indexes.shift();
      if (!index) return;

      Bank.updateValue(this.state.bank, index, indexes, value);
      this.setState({bank: this.state.bank, updated: true});
    },

    addHeaderCallback: (type: string) => {
      let new_headers = JSON.parse(JSON.stringify(this.state.headers));
      this.state.bank.headers[type].push({
        $edit: true,
        id: uuid.v4()
      });
  
      this.setState({bank: this.state.bank, updated: true});
    }
  };
  
  render () {
    const {loading, updated, bank, saveInProgress} = this.state;

    return (
      <React.Fragment>
        {loading && <LoadingPanel />}
        {!loading && <SavePanel label="Settings" 
                                bank={bank}
                                updated={updated}
                                saveInProgress={saveInProgress}
                                cancelChanges={this.cancelChanges}
                                callback={() => {}} 
                                saveClick={this.saveHeaders} />}
        {!loading && <Container fluid className="top-shadow">
          <Row>
            <Col className="pl-0 pr-0">
              <Container>
                <StartingPoint {...this.state} {...this.callbacks} /> 
                <Savings bank={bank} {...this.state} {...this.callbacks} /> 
                <Incomes bank={bank} {...this.state} {...this.callbacks} /> 
              </Container>
            </Col>
          </Row>
          
        </Container>}
      </React.Fragment>
    );
  }
}
