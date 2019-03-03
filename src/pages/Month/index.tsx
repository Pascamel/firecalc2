import React, { Component} from 'react';
import { Container, Row } from 'reactstrap';
import { RouteComponentProps } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { Bank } from '../../bank';
import { AuthUserContext } from '../../firebase/AuthUserContext';
import { withAuthorization } from '../../firebase/withAuthorization';

import { LoadingPanel } from '../../components/LoadingPanel';
import { SavePanel } from '../../components/SavePanel';
import helpers from '../../helpers';
// import MonthChart from './monthChart';
import MonthFinances from './monthFinances';


interface IProps extends RouteComponentProps<{month: string, year: string}> {

}

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
    console.log('mount props', this.props)
    let bank = this.state.bank;
    this.state.bank.load().then(() => {
      this.setState({bank: this.state.bank, loading: false});
      console.log(bank);
      console.log('income')
      console.log(bank.income);
      console.log('savings')
      console.log(bank.savings);
    });  //.catch(() -> {});
  }

  prevMonth = () => {
    let month = parseInt(this.state.month);
    let year = parseInt(this.state.year);

    month -= 1;
    if (month < 1) {
      month = 12;
      year--;
    }

    const route = ROUTES.MONTH.replace(':year', year.toString()).replace(':month', month.toString());
    this.props.history.push(route);
    this.setState({month: month.toString(), year: year.toString()});
  }

  nextMonth = () => {
    let month = parseInt(this.state.month);
    let year = parseInt(this.state.year);

    month += 1;
    if (month > 12) {
      month = 1;
      year++;
    }

    const route = ROUTES.MONTH.replace(':year', year.toString()).replace(':month', month.toString());
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
    // this.setState({saveInProgress: true});
    // this.state.bank.saveSavings().then(() => {
    //   this.state.bank.saveIncome().then((saved) => {
    //     this.setState({
    //       updated: !saved, 
    //       saveInProgress: false
    //     });
    //   }).catch((error) => {});
    // }).catch((error) => {});
  }

  render() {
    const { loading, month, year /*, error*/ } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <React.Fragment>
            {loading && <LoadingPanel />}
            {!loading && <SavePanel label={`${helpers.labelMonth(month)} ${year}`} saveClick={this.saveData} prevMonth={this.prevMonth} nextMonth={this.nextMonth} callback={() => {}} {...this.state} />}
            {!loading && <Container>
              <Row>
                <MonthFinances {...this.state} callbackSavings={this.updateSavings} callbackIncome={this.updateIncome} />
                {/* <MonthChart {...this.state} /> */}
              </Row>
            </Container>}
          </React.Fragment>
        )}
      </AuthUserContext.Consumer>
    )
  }
}

const authCondition = (authUser: firebase.User) => !!authUser;

export const MonthPage = withAuthorization(authCondition)(MonthPageBase);
// export const withAuthorization(authCondition)(MonthPage);

