import _ from 'lodash';
import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { LoadingPanel, Mobile, NotMobile } from '../../components';
import * as CHARTS from '../../constants/charts';
import { AppState } from '../../store';
import * as Charts from './charts';
import ChartSelector from './chartSelector';
import {
    IAllocationEvolutionChart, IBreakEvenPointChartData, IChartAllocationData,
    IIncomeVsSavingsChartData, INetWorthVsSavingsChartData, ISavingsBreakdownChartData,
    IYearlyGoalBurnUpChartData
} from './interfaces';
import ProjectionChart from './projectionChart';
import YearlyBreakdown from './yearlyBreakdown';

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

  const mapBankToRecap = (bank: Bank.IBank) => {
    const svsi: IIncomeVsSavingsChartData[] = [];
    const nws: INetWorthVsSavingsChartData[] = [];
    const sb: ISavingsBreakdownChartData[] = [];
    const sae: IAllocationEvolutionChart[] = [];
    const bep: IBreakEvenPointChartData[] = [];
    const ybu: IYearlyGoalBurnUpChartData[] = [];

    _.each(
      _.range(bank.headers.firstYear, new Date().getFullYear() + 1),
      (y: number) => {
        const m1 = y === bank.headers.firstYear ? bank.headers.firstMonth : 1;
        const m2 =
          y === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;

        _.each(_.range(m1, m2 + 1), m => {
          svsi.push({
            date: new Date(y, m, 0).getTime(), // last day of m-1
            savings: _.get(bank.totalMonthSavings, [y, m], 0),
            income: _.get(bank.totalMonthIncome, [y, m], 0)
          });

          nws.push({
            date: new Date(y, m, 0).getTime(),
            netWorth: _.get(bank.networth, [y, m], null) as number | null,
            savings: _.get(bank.totalHolding, [y, m], 0)
          });

          sae.push({
            date: new Date(y, m, 0).getTime(),
            allocation: _(bank.savingsInputs)
              .filter(
                header =>
                  header.types.indexOf('T') === -1 || header.type === 'T'
              )
              .reduce((acc, header) => {
                const key = _(bank.savingsHeaders)
                  .keyBy('id')
                  .get([header.id]).label;
                const value =
                  (acc[key] || 0) +
                  _.get(bank.grandTotalMonthInstitution, [y, m, header.id]);
                return { ...acc, [key]: value };
              }, {} as IChartAllocationData)
          });

          if (_.get(bank.networth, [y, m])) {
            const manual_expenses = _.get(bank.expenses, [y, m], 0);
            const automatic_expenses =
              _.get(bank.totalMonthIncome, [y, m], 0) -
              _.get(bank.totalMonthSavings, [y, m], 0);

            bep.push({
              date: new Date(y, m, 0).getTime(),
              income: Math.round(
                parseFloat(_.get(bank.networth, [y, m], '0')) / 300
              ),
              expenses:
                manual_expenses !== 0
                  ? manual_expenses
                  : Math.max(0, automatic_expenses)
            });
          }
        });

        _.each(_.range(m1, 13), m => {
          ybu.push({
            date: new Date(y, m, 0).getTime(),
            goal: m * _.get(bank.monthlyGoal, y, 0),
            done:
              m <= m2
                ? m * _.get(bank.monthlyGoal, y, 0) +
                  _.get(bank.goalYearToDate, [y, m], 0)
                : null
          });
        });
      }
    );

    _(bank.savingsInputs)
      .filter(header => {
        return header.types.indexOf('T') === -1 || header.type === 'T';
      })
      .each(header => {
        const h = _(bank.savingsHeaders)
          .keyBy('id')
          .get([header.id]);
        if (!h) return;

        let header_label = h.label || 'N/A';
        if (h.sublabel) header_label += ' > ' + h.sublabel;

        sb.push({
          name: header_label,
          value: bank.grandTotalInstitution[header.id][header.type] //123,
        });
      });

    return { svsi, nws, sb, sae, bep, ybu };
  };

  const chartsBlock = (mobile: boolean, recap: IRecap) => (
    <>
      {type === CHARTS.URL.INCOME_VS_SAVINGS && (
        <YearlyBreakdown
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
        <Charts.SavingsBreakdownChart
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
          chart={type}
          data={recap.ybu}
          mobile={mobile}
          {...props}
          hideAll={true}
        />
      )}
      {type === CHARTS.URL.PROJECTION && (
        <ProjectionChart mobile={mobile} chart={type} {...props} />
      )}
    </>
  );

  if (!bankLoaded) return <LoadingPanel />;

  const recap = mapBankToRecap(bank);

  return (
    <>
      <ChartSelector
        type={type}
        history={props.history}
        match={props.match}
        location={props.location}
      />
      <Container fluid className="top-shadow chart-container">
        <Row>
          <Col className="pl-0 pr-0">
            <Container>
              <Row>
                <Col>
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
    darkMode: state.sessionState.darkMode
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onLoadBank: (uid: string) => dispatch(loadBank(uid))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartsPageBase);
