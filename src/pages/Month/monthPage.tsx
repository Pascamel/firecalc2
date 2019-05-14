import React from 'react';
import { connect } from 'react-redux';
import { loadBank, updateValue, saveBank } from '../../actions';
import { Container, Row, Col } from 'reactstrap';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as Bank from '../../bank';
import helpers from '../../helpers';
import { LoadingPanel, SavePanel } from '../../components';
import Finances from './finances';
import Charts from './charts';
import { Swipe } from 'react-swipe-component';


interface IProps extends RouteComponentProps<{month: string, year: string}> {
  authUser: firebase.User|null,
  bank: Bank.IBank,
  bankLoaded: boolean,
  bankUpdated: boolean,
  onLoadBank: (uid: string) => void,
  onUpdateValue: (bank: Bank.IBank, index: string, indexes: string[], amount: number) => void,
  onSaveBank: (bank: Bank.IBank, uid: string) => void
}

interface IState {
  year: string,
  month: string
}

class MonthPageBase extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      // updated: false,
      year: props.match.params.year || '0',
      month: props.match.params.month || '0'
    }
  }

  componentDidMount () {
    const { authUser, onLoadBank, bankLoaded } = this.props;
    if (bankLoaded || !authUser ) return;
    
    onLoadBank(authUser.uid);
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
    this.props.onUpdateValue(this.props.bank, index, indexes, amount);
  }

  updateIncome = (index: string, indexes: string[], amount: number) => {
    this.props.onUpdateValue(this.props.bank, index, indexes, amount);
  }

  updateNetWorth = (index: string, indexes: string[], amount: number) => {
    this.props.onUpdateValue(this.props.bank, index, indexes, amount);
  }

  saveData = () => {
    if (!this.props.authUser) return;

    this.props.onSaveBank(this.props.bank, this.props.authUser.uid);
  }

  cancelChanges = () => {
    if (!this.props.authUser) return;

    this.props.onLoadBank(this.props.authUser.uid);
  }

  invalidRouteParams = () => {
    const m: number = parseInt(this.state.month);
    const y: number = parseInt(this.state.year);
    let redirect = false;

    redirect = redirect || !m;
    redirect = redirect || !y;
    redirect = redirect || m < 1;
    redirect = redirect || m > 12;
    redirect = redirect || y < this.props.bank.headers.firstYear;
    redirect = redirect || y === this.props.bank.headers.firstYear && m < this.props.bank.headers.firstMonth;
    redirect = redirect || y > new Date().getFullYear() + 1

    return redirect;
  }

  render() {
    const { month, year } = this.state;
    const { bankLoaded, bankUpdated } = this.props;

    if (!bankLoaded) return <LoadingPanel />;
    
    if (this.invalidRouteParams()) {
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
      <>
        <SavePanel label={`${helpers.labelMonth(month)} ${year}`} 
                   saveClick={this.saveData} 
                   cancelChanges={this.cancelChanges}
                   prevMonth={this.prevMonth} 
                   nextMonth={this.nextMonth} 
                   callback={() => {}}
                   bank={this.props.bank} 
                   saveInProgress={false}
                   updated={bankUpdated}
                   {...this.state} />
        <Swipe detectMouse={false} detectTouch={true} onSwipedLeft={this.nextMonth} onSwipedRight={this.prevMonth} >
          <Container fluid className="top-shadow">
            <Row>
              <Col className="pr-0 pl-0">
                <Container>
                  <Row>
                    <Finances callbackSavings={this.updateSavings} 
                              callbackIncome={this.updateIncome} 
                              bank={this.props.bank} 
                              {...this.state} />
                    <Charts callback={this.updateNetWorth} 
                            {...this.state} />
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
        </Swipe>}
      </>
    )
  }
}

const mapStateToProps = (state: any) => {
  return ({
    authUser: state.sessionState.authUser,
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded,
    bankUpdated: state.bankState.bankUpdated
  });
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onLoadBank: (uid: string) => {
      dispatch(loadBank(uid));
    },
    onUpdateValue: (bank: Bank.IBank, index: string, indexes: string[], amount: number) => {
      dispatch(updateValue(bank, index, indexes, amount));
    },
    onSaveBank: (bank: Bank.IBank, uid: string) => {
      dispatch(saveBank(bank, uid));
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MonthPageBase);