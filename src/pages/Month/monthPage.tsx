import React from 'react';
import { Container, Row } from 'reactstrap';
import { RouteComponentProps } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { Bank } from '../../bank';
import helpers from '../../helpers';
import LoadingPanel from '../../components/LoadingPanel';
import SavePanel from '../../components/SavePanel';
import Finances from './finances';
import Charts from './charts';


interface IProps extends RouteComponentProps<{month: string, year: string}> {}

interface IState {
  bank: Bank,
  loading: boolean,
  updated: boolean,
  saveInProgress: boolean,
  year: string,
  month: string
}

export default class MonthPageBase extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      bank: new Bank(),
      loading: true,
      updated: false,
      saveInProgress: false,
      year: props.match.params.year || '0',
      month: props.match.params.month || '0'
    }
  }

  componentDidMount () {
    this.state.bank.load().then(() => {
      this.setState({bank: this.state.bank, loading: false});
    });
  }

  prevMonth = () => {
    const { year, month } = helpers.prevMonth(this.state.year, this.state.month)
    const route = ROUTES.MONTH.replace(':year', year).replace(':month', month);

    this.props.history.push(route);
    this.setState({month: month.toString(), year: year.toString()});
  }

  nextMonth = () => {
    const { year, month } = helpers.nextMonth(this.state.year, this.state.month)
    const route = ROUTES.MONTH.replace(':year', year).replace(':month', month);
    
    this.props.history.push(route);
    this.setState({month: month.toString(), year: year.toString()});
  }

  updateSavings = (index: string, indexes: string[], amount: number) => {
    this.state.bank.updateValue(index, indexes, amount);
    this.setState({bank: this.state.bank, updated: true});
  }

  updateIncome = (index: string, indexes: string[], amount: number) => {
    this.state.bank.updateValue(index, indexes, amount);
    this.setState({bank: this.state.bank, updated: true});
  }

  updateNetWorth = (index: string, indexes: string[], amount: number) => {
    this.state.bank.updateValue(index, indexes, amount);
    this.setState({bank: this.state.bank, updated: true});
  }

  saveData = () => {
    this.setState({saveInProgress: true});
    this.state.bank.saveSavings().then(() => {
      this.state.bank.saveIncome().then(() => {
        this.state.bank.saveNetWorth().then((saved) => {
          this.setState({
            updated: !saved, 
            saveInProgress: false
          });
        });
      }).catch((error) => {});
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
    const { loading, month, year } = this.state;

    return (
      <React.Fragment>
        {loading && <LoadingPanel />}
        {!loading && <SavePanel label={`${helpers.labelMonth(month)} ${year}`} 
                                saveClick={this.saveData} 
                                cancelChanges={this.cancelChanges}
                                prevMonth={this.prevMonth} 
                                nextMonth={this.nextMonth} 
                                callback={() => {}} 
                                {...this.state} />}
        {!loading && <Container>
          <Row>
            <Finances {...this.state} callbackSavings={this.updateSavings} callbackIncome={this.updateIncome} />
            <Charts {...this.state} callback={this.updateNetWorth} />
          </Row>
        </Container>}
      </React.Fragment>
    )
  }
}