import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { LoadingPanel, SavePanel } from '../../components';
import ROUTES from '../../constants/routes';
import { currentMonthRoute, labelMonth, nextMonth, prevMonth } from '../../helpers';
import { AppState } from '../../store';
import Expenses from './expenses';
import Header from './header';
import Incomes from './incomes';
import Savings from './savings';

interface IProps extends RouteComponentProps<{ month: string; year: string }> {
  authUser: firebase.User | null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  bankLoading: boolean;
  onLoadBank: (uid: string) => void;
}

const MonthPageBase = ({
  authUser,
  bank,
  bankLoaded,
  bankLoading,
  onLoadBank,
  location,
  history,
  match,
}: IProps & RouteComponentProps) => {
  const [year, setYear] = useState<string>(match.params.year || '0');
  const [month, setMonth] = useState(match.params.month || '0');

  useEffect(() => {
    if (bankLoaded || bankLoading || !authUser) {
      return;
    }
    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, bankLoading, onLoadBank]);

  const goPrevMonth = () => {
    const p = prevMonth(year, month);
    const route = ROUTES.MONTH.replace(':year', p.year).replace(
      ':month',
      p.month
    );

    history.push(route);
    setMonth(p.month.toString());
    setYear(p.year.toString());
  };

  const goNextMonth = () => {
    const n = nextMonth(year, month);
    const route = ROUTES.MONTH.replace(':year', n.year).replace(
      ':month',
      n.month
    );

    history.push(route);
    setMonth(n.month.toString());
    setYear(n.year.toString());
  };

  const invalidRouteParams = () => {
    const m: number = parseInt(month);
    const y: number = parseInt(year);
    let redirect = false;

    redirect = redirect || !m;
    redirect = redirect || !y;
    redirect = redirect || m < 1;
    redirect = redirect || m > 12;
    redirect = redirect || y < bank.headers.firstYear;
    redirect =
      redirect || (y === bank.headers.firstYear && m < bank.headers.firstMonth);
    redirect = redirect || y > new Date().getFullYear() + 1;

    return redirect;
  };

  if (!bankLoaded) return <LoadingPanel />;

  if (invalidRouteParams()) {
    setMonth((new Date().getMonth() + 1).toString());
    setYear(new Date().getFullYear().toString());

    return (
      <Redirect
        to={{
          pathname: currentMonthRoute(),
          state: { from: location },
        }}
      />
    );
  }

  const m = parseInt(month);
  const y = parseInt(year);

  const savePanelProps = {
    prevMonth: goPrevMonth,
    prevMonthDisabled:
      y < bank.headers.firstYear ||
      (y === bank.headers.firstYear && m <= bank.headers.firstMonth),
    nextMonth: goNextMonth,
    nextMonthDisabled:
      y > new Date().getFullYear() ||
      (y === new Date().getFullYear() && m === 12),
  };

  return (
    <>
      <SavePanel
        className="d-block d-sm-none"
        label={labelMonth(month, year, true)}
        {...savePanelProps}
      />
      <SavePanel
        className="d-none d-sm-block"
        label={labelMonth(month, year)}
        {...savePanelProps}
      />
      <Container fluid className="top-shadow">
        <Row>
          <Col className="pr-0 pl-0">
            <Container>
              <Row className="d-none d-sm-block">
                <Col>
                  <Header month={month} year={year} />
                </Col>
              </Row>
              <Row>
                <Savings month={month} year={year} />
                <Incomes month={month} year={year} />
                <Expenses month={month} year={year} />
              </Row>
              <Row className="d-block d-sm-none">
                <Col>
                  <Header month={month} year={year} />
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    authUser: state.sessionState.authUser,
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded,
    bankLoading: state.bankState.bankLoading,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, void, AnyAction>
) => {
  return {
    onLoadBank: (uid: string) => {
      dispatch(loadBank(uid));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MonthPageBase);
