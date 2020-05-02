import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import Responsive from 'react-responsive';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { HeaderPanel, LoadingPanel } from '../../components';
import CHARTS from '../../constants/charts';
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
  bankLoading: boolean;
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
  eae: IAllocationEvolutionChart[];
}

const ChartsPageBase = ({
  authUser,
  bank,
  bankLoaded,
  bankLoading,
  darkMode,
  history,
  match,
  location,
  onLoadBank,
}: IProps & RouteComponentProps) => {
  const [type, setType] = useState(match.params.type || '');
  const routeProps = { history, match, location };

  useEffect(() => {
    if (bankLoaded || bankLoading || !authUser) {
      return;
    }
    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, bankLoading, onLoadBank]);

  useEffect(() => {
    if (type === (match.params.type || '')) return;

    setType(match.params.type || '');
  }, [match, bank, type]);

  const chartsBlock = (mobile: boolean, recap: IRecap) => (
    <>
      {type === CHARTS.INCOME_VS_SAVINGS.URL && (
        <YearlyBreakdown
          no-switch
          chart={type}
          data={recap.svsi}
          mobile={mobile}
          {...routeProps}
        />
      )}
      {type === CHARTS.NET_WORTH_VS_SAVINGS.URL && (
        <YearlyBreakdown
          chart={type}
          data={recap.nws}
          mobile={mobile}
          {...routeProps}
        />
      )}
      {type === CHARTS.SAVINGS_BREAKDOWN.URL && (
        <SavingsBreakdownChart
          data={recap.sb}
          mobile={mobile}
          darkMode={darkMode}
        />
      )}
      {type === CHARTS.SAVINGS_ALLOCATION_EVOLUTION.URL && (
        <YearlyBreakdown
          chart={type}
          data={recap.sae}
          mobile={mobile}
          {...routeProps}
        />
      )}
      {type === CHARTS.EXPENSES_ALLOCATION_EVOLUTION.URL && (
        <YearlyBreakdown
          chart={type}
          data={recap.eae}
          mobile={mobile}
          {...routeProps}
        />
      )}
      {type === CHARTS.BREAK_EVEN_POINT.URL && (
        <YearlyBreakdown
          chart={type}
          data={recap.bep}
          mobile={mobile}
          {...routeProps}
        />
      )}
      {type === CHARTS.YEARLY_GOAL_BURNUP.URL && (
        <YearlyBreakdown
          hide-all
          chart={type}
          data={recap.ybu}
          mobile={mobile}
          {...routeProps}
        />
      )}
      {type === CHARTS.PROJECTION.URL && (
        <ProjectionChartPage mobile={mobile} chart={type} {...routeProps} />
      )}
    </>
  );

  if (!bankLoaded) return <LoadingPanel />;

  const recap = Helpers.mapBankToRecap(bank);

  return (
    <>
      <HeaderPanel title="Charts" />

      <Container fluid className="top-shadow chart-container">
        <Row>
          <Col className="pl-0 pr-0">
            <Container>
              <Row>
                <Col md={2} sm={12}>
                  <Selector type={type} {...routeProps} />
                </Col>

                <Col md={10} sm={12} className="d-block d-sm-none">
                  {chartsBlock(true, recap)}
                </Col>
                <Col md={10} sm={12} className="d-none d-sm-block">
                  <div>{chartsBlock(false, recap)}</div>
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
    darkMode: state.sessionState.darkMode,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, void, AnyAction>
) => {
  return {
    onLoadBank: (uid: string) => dispatch(loadBank(uid)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartsPageBase);
