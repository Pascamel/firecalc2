import React, { Component} from 'react';
import { Container, Row } from 'reactstrap';
import { RouteComponentProps } from "react-router-dom";
import { withAuthorization } from '../../firebase/withAuthorization';
import * as ROUTES from "../../constants/routes";
import { Bank } from '../../bank';
import helpers from '../../helpers';
import { LoadingPanel } from '../../components/LoadingPanel';
import { SavePanel } from '../../components/SavePanel';
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

class MonthPageBase extends Component<IProps, IState> {
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
    let bank = this.state.bank;
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

  saveData = () => {
    this.setState({saveInProgress: true});
    this.state.bank.saveSavings().then(() => {
      this.state.bank.saveIncome().then((saved) => {
        this.setState({
          updated: !saved, 
          saveInProgress: false
        });
      }).catch((error) => {});
    }).catch((error) => {});
  }

  render() {
    const { loading, month, year /*, error*/ } = this.state;

    return (
      <React.Fragment>
        {loading && <LoadingPanel />}
        {!loading && <SavePanel label={`${helpers.labelMonth(month)} ${year}`} saveClick={this.saveData} prevMonth={this.prevMonth} nextMonth={this.nextMonth} callback={() => {}} {...this.state} />}
        {!loading && <Container>
          <Row>
            <Finances {...this.state} callbackSavings={this.updateSavings} callbackIncome={this.updateIncome} />
            <Charts {...this.state} />
          </Row>
        </Container>}
      </React.Fragment>
    )
  }
}

const authCondition = (authUser: firebase.User) => !!authUser;

export const MonthPage = withAuthorization(authCondition)(MonthPageBase);
