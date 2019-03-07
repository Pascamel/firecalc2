import React from 'react';
import _ from 'lodash';
import uuid from "uuid";
import { withAuthorization } from '../../firebase/withAuthorization';
import { Bank } from '../../bank';
import LoadingPanel from '../../components/LoadingPanel';
import SavePanel from '../../components/SavePanel';
import StartingPoint from './startingPoint';
import Savings from './savings';
import Incomes from './incomes';


class HeadersPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      bank: new Bank(),
      loading: true,
      updated: false,
      saveInProgress: false,
      headers: {
        headers: [],
        incomes: [],
        startingCapital: 0
      }
    };
  }

  default_headers = {
    savings: [],
    incomes: [],
    startingCapital: 0
  }

  componentDidMount () {
    this.state.bank.load().then(() => {
      this.setState({
        bank: this.state.bank,
        loading: false});
    });
  }

  cancelChanges = () => {
    this.state.bank.load().then(() => {
      this.setState({
        updated: false,
        bank: this.state.bank
      });
    });
  }

  saveHeaders = () => {
    this.setState({saveInProgress: true});

    this.state.bank.saveHeaders().then((saved: boolean) => {
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

      this.setState({bank: this.state.bank, updated: true});
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

      this.setState({bank: this.state.bank, updated: true});
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

      this.state.bank.updateValue(index, indexes, value);
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
      {!loading && <SavePanel label="Settings" 
                              bank={bank}
                              updated={updated}
                              saveInProgress={saveInProgress}
                              cancelChanges={this.cancelChanges}
                              callback={() => {}} 
                              saveClick={this.saveHeaders} />}
      <div className="container">
        {loading && <LoadingPanel />}
        {!loading && <StartingPoint {...this.state} {...this.callbacks} /> }
        {!loading && <Savings bank={bank} {...this.state} {...this.callbacks} /> }
        {!loading && <Incomes bank={bank} {...this.state} {...this.callbacks} /> }
      </div>         
      </React.Fragment>
    );
  }
}

const authCondition = (authUser: firebase.User) => !!authUser;

export default withAuthorization(authCondition)(HeadersPage);
