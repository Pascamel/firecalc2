import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { HeaderPanel, LoadingPanel, Mobile, NotMobile } from '../../components';
import * as CHARTS from '../../constants/charts';
import { AppState } from '../../store';
import { IAllocationEvolutionChart } from './allocationEvolutionChart';
import { IBreakEvenPointChartData } from './breakEvenPointChart';
import Helpers from './helpers';
import { IIncomeVsSavingsChartData } from './incomeVsSavingsChart';
import { ISavingsBreakdownChartData } from './interfaces';
import { INetWorthVsSavingsChartData } from './netWorthVsSavingsChart';
import ProjectionChartPage from './projectionChartPage';
import SavingsBreakdownChart from './savingsBreakdownChart';
import Selector from './selector';
import YearlyBreakdown from './yearlyBreakdown';
import { IYearlyGoalBurnUpChartData } from './yearlyGoalBurnUp';

interface IProps extends RouteComponentProps<{ type: string }> {
  authUser: firebase.User | null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  onLoadBank: (uid: string) => void;
  darkMode: boolean;
}

interface IRecap {
  svsi: IIncomeVsSavingsChartData[];
  nws: INetWorthVsSavingsChartData[];
  sb: ISavingsBreakdownChartData[];
  sae: IAllocationEvolutionChart[];
  bep: IBreakEvenPointChartData[];
  ybu: IYearlyGoalBurnUpChartData[];
}

const ChartsPageBase = (props: IProps & RouteComponentProps) => {
  const { match, authUser, bank, onLoadBank, bankLoaded } = props;
  const [type, setType] = useState(match.params.type || '');

  useEffect(() => {
    if (bankLoaded || !authUser) return;

    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, onLoadBank]);

  useEffect(() => {
    if (type === (match.params.type || '')) return;

    setType(match.params.type || '');
  }, [match, bank, type]);

  const chartsBlock = (mobile: boolean, recap: IRecap) => (
    <>
      {type === CHARTS.URL.INCOME_VS_SAVINGS && (
        <YearlyBreakdown
          no-switch
          chart={type}
          data={recap.svsi}
          mobile={mobile}
          {...props}
        />
      )}
      {type === CHARTS.URL.NET_WORTH_VS_SAVINGS && (
        <YearlyBreakdown
          chart={type}
          data={recap.nws}
          mobile={mobile}
          {...props}
        />
      )}
      {type === CHARTS.URL.SAVINGS_BREAKDOWN && (
        <SavingsBreakdownChart
          data={recap.sb}
          mobile={mobile}
          darkMode={props.darkMode}
        />
      )}
      {type === CHARTS.URL.ALLOCATION_EVOLUTION && (
        <YearlyBreakdown
          chart={type}
          data={recap.sae}
          mobile={mobile}
          {...props}
        />
      )}
      {type === CHARTS.URL.BREAK_EVEN_POINT && (
        <YearlyBreakdown
          chart={type}
          data={recap.bep}
          mobile={mobile}
          {...props}
        />
      )}
      {type === CHARTS.URL.YEARLY_GOAL_BURNUP && (
        <YearlyBreakdown
          hide-all
          chart={type}
          data={recap.ybu}
          mobile={mobile}
          {...props}
        />
      )}
      {type === CHARTS.URL.PROJECTION && (
        <ProjectionChartPage mobile={mobile} chart={type} {...props} />
      )}
    </>
  );

  if (!bankLoaded) return <LoadingPanel />;

  const recap = Helpers.mapBankToRecap(bank);

  const selectorProps = {
    type,
    ...props,
  };

  return (
    <>
      <HeaderPanel title="Charts" />

      <Container fluid className="top-shadow chart-container">
        <Row>
          <Col className="pl-0 pr-0">
            <Container>
              <Row>
                <Col md={2} sm={12}>
                  <Selector
                    type={type}
                    history={props.history}
                    match={props.match}
                    location={props.location}
                  />
                </Col>
                <Col md={10} sm={12}>
                  <Mobile>{chartsBlock(true, recap)}</Mobile>
                  <NotMobile>{chartsBlock(false, recap)}</NotMobile>
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
    darkMode: state.sessionState.darkMode,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onLoadBank: (uid: string) => dispatch(loadBank(uid)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartsPageBase);
