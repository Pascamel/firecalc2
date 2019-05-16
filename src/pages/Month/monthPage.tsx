import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Swipe } from 'react-swipe-component';
import { Col, Container, Row } from 'reactstrap';

import { loadBank, saveBank, updateValue } from '../../actions';
import * as Bank from '../../bank';
import { LoadingPanel, SavePanel } from '../../components';
import * as ROUTES from '../../constants/routes';
import helpers from '../../helpers';
import { AppState } from '../../store';
import Charts from './charts';
import Finances from './finances';


interface IProps extends RouteComponentProps<{month: string, year: string}> {
  authUser: firebase.User|null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  bankUpdated: boolean;
  saveInProgress: boolean;
  onLoadBank: (uid: string) => void;
  onUpdateValue: (index: string, indexes: string[], amount: number) => void;
  onSaveBank: (uid: string, bank: Bank.IBank) => void;
}

interface IState {
  year: string;
  month: string;
}

class MonthPageBase extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      year: props.match.params.year || '0',
      month: props.match.params.month || '0'
    }
  }

  componentDidMount() {
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
    const { bankLoaded, bankUpdated, saveInProgress } = this.props;

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
        <SavePanel label={`${helpers.labelMonth(month)} ${year}`} prevMonth={this.prevMonth} nextMonth={this.nextMonth} />
        <Swipe detectMouse={false} detectTouch={true} onSwipedLeft={this.nextMonth} onSwipedRight={this.prevMonth} >
          <Container fluid className="top-shadow">
            <Row>
              <Col className="pr-0 pl-0">
                <Container>
                  <Row>
                    <Finances {...this.state} />
                    <Charts {...this.state} />
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

const mapStateToProps = (state: AppState) => {
  return ({
    authUser: state.sessionState.authUser,
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded,
    bankUpdated: state.bankState.bankUpdated,
    saveInProgress: state.bankState.saveInProgress
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onLoadBank: (uid: string) => {
      dispatch(loadBank(uid));
    },
    onUpdateValue: (index: string, indexes: string[], amount: number) => {
      dispatch(updateValue(index, indexes, amount));
    },
    onSaveBank: (uid: string, bank: Bank.IBank) => {
      dispatch(saveBank(uid, bank));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MonthPageBase);
