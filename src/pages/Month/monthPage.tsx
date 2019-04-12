import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { Bank } from '../../bank';
import helpers from '../../helpers';
import { LoadingPanel, SavePanel } from '../../components';
import Finances from './finances';
import Charts from './charts';
import { Swipe } from 'react-swipe-component';
import StartingPoint from '../Settings/startingPoint';


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
    const { year, month } = helpers.prevMonth(this.state.year, this.state.month);
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

  invalidRouteParams = () => {
    const m: number = parseInt(this.state.month);
    const y: number = parseInt(this.state.year);
    let redirect = false;

    redirect = redirect || !m;
    redirect = redirect || !y;
    redirect = redirect || m < 1;
    redirect = redirect || m > 12;
    redirect = redirect || y < this.state.bank.headers.firstYear;
    redirect = redirect || y === this.state.bank.headers.firstYear && m < this.state.bank.headers.firstMonth;
    redirect = redirect || y > new Date().getFullYear() + 1

    return redirect;
  }

  render() {
    const { loading, month, year, bank } = this.state;
    
    if (!loading && this.invalidRouteParams()) {
      this.setState({
        month: (new Date().getMonth() + 1).toString(), 
        year: (new Date().getFullYear()).toString()
      });
      return <Redirect to={{
        pathname: helpers.currentMonthRoute(),
        state: { from: this.props.location }
      }}/>
    }

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
        {!loading && <Swipe detectMouse={false} detectTouch={true} onSwipedLeft={this.nextMonth} onSwipedRight={this.prevMonth} >
          <Container fluid className="top-shadow">
            <Row>
              <Col>
                <Container>
                  <Row>
                    <Finances {...this.state} callbackSavings={this.updateSavings} callbackIncome={this.updateIncome} />
                    <Charts {...this.state} callback={this.updateNetWorth} />
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </Swipe>}
      </React.Fragment>
    )
  }
}