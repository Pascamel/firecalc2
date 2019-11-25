import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { LoadingPanel, Mobile, NotMobile, SavePanel } from '../../components';
import * as ROUTES from '../../constants/routes';
import helpers from '../../helpers';
import { AppState } from '../../store';
import Charts from './charts';
import Finances from './finances';

interface IProps extends RouteComponentProps<{month: string, year: string}> {
  authUser: firebase.User|null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  onLoadBank: (uid: string) => void;
}

const MonthPageBase = (props: IProps & RouteComponentProps) => {
  const { authUser, bank, bankLoaded, onLoadBank, location, history, match } = props;
  const [year, setYear] = useState<string>(match.params.year || '0');
  const [month, setMonth] = useState(match.params.month || '0');

  useEffect(() => {
    if (bankLoaded || !authUser ) return;
    
    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, onLoadBank]);

  const prevMonth = () => {
    const p = helpers.prevMonth(year, month);
    const route = ROUTES.MONTH.replace(':year', p.year).replace(':month', p.month);

    history.push(route);
    setMonth(p.month.toString());
    setYear(p.year.toString());
  }

  const nextMonth = () => {
    const n = helpers.nextMonth(year, month);
    const route = ROUTES.MONTH.replace(':year', n.year).replace(':month', n.month);
    
    history.push(route);
    setMonth(n.month.toString());
    setYear(n.year.toString());
  }

  const invalidRouteParams = () => {
    const m: number = parseInt(month);
    const y: number = parseInt(year);
    let redirect = false;

    redirect = redirect || !m;
    redirect = redirect || !y;
    redirect = redirect || m < 1;
    redirect = redirect || m > 12;
    redirect = redirect || y < bank.headers.firstYear;
    redirect = redirect || (y === bank.headers.firstYear && m < bank.headers.firstMonth);
    redirect = redirect || y > new Date().getFullYear() + 1

    return redirect;
  }

  if (!bankLoaded) return <LoadingPanel />;
  
  if (invalidRouteParams()) {
    setMonth((new Date().getMonth() + 1).toString());
    setYear((new Date().getFullYear()).toString());
    
    return <Redirect to={{
      pathname: helpers.currentMonthRoute(),
      state: { from: location }
    }}/>
  }

  return (
    <>
      <Mobile>
        <SavePanel label={helpers.labelMonth(month, year, true)} prevMonth={prevMonth} nextMonth={nextMonth} />
      </Mobile>
      <NotMobile>
        <SavePanel label={helpers.labelMonth(month, year)} prevMonth={prevMonth} nextMonth={nextMonth} />
      </NotMobile>
      <Container fluid className="top-shadow">
        <Row>
          <Col className="pr-0 pl-0">
            <Container>
              <Row>
                <Finances month={month} year={year} />
                <Charts month={month} year={year} />
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  )
}

const mapStateToProps = (state: AppState) => {
  return ({
    authUser: state.sessionState.authUser,
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onLoadBank: (uid: string) => {
      dispatch(loadBank(uid));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MonthPageBase);
