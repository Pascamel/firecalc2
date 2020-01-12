import _ from 'lodash';
import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { LoadingPanel, Mobile, NotMobile } from '../../components';
import * as CHARTS from '../../constants/charts';
import helpers from '../../helpers';
import { AppState } from '../../store';
import * as Charts from './charts';
import { IArrayDateNumber, IArrayDateNumberNull, IYearlyArrayDateNumberNull } from './interfaces';
import ProjectionChart from './projectionChart';
import Selector from './selector';
import YearlyBreakdown from './yearlyBreakdown';
import YearlyGoalBurnUpChart from './yearlyGoalBurnUpChart';

interface IProps extends RouteComponentProps<{type: string}> {
  authUser: firebase.User|null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  onLoadBank: (uid: string) => void;
  darkMode: boolean;
}

interface IRecap {
  svsi: IArrayDateNumber;
  nws: IArrayDateNumberNull;
  sb: IArrayDateNumber;
  sae: IArrayDateNumber;
  bep: IArrayDateNumber;
  ybu: IYearlyArrayDateNumberNull;
}

const ChartsPageBase = (props: IProps & RouteComponentProps) => {
  const { match, authUser, bank, onLoadBank, bankLoaded } = props; 
  const [type, setType] = useState(match.params.type || '');

  useEffect(() => {
    if (bankLoaded || !authUser ) return;
    
    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, onLoadBank]);

  useEffect(() => {
    if (type === (match.params.type || '')) return;

    setType(match.params.type || '');
  }, [match, bank, type]);

  const mapBankToRecap = (bank: Bank.IBank) => {
    const svsi: IArrayDateNumber = [['Date', 'Savings', 'Income']];
    const nws: IArrayDateNumberNull = [['Date', 'Net Worth', 'Savings']];
    const sb: IArrayDateNumber = [['Institution', 'Amount']];
    const sae: IArrayDateNumber = [_.concat(['Date'], _(bank.savingsInputs)
      .filter((header) => (header.types.indexOf('T') === -1) || (header.type === 'T'))
      .map((header) => _(bank.savingsHeaders).keyBy('id').get([header.id, 'label'], 'N/A'))
      .value()
    )];
    const bep: IArrayDateNumber = [['Date', 'Passive income', 'Expenses']];
    const ybu: IYearlyArrayDateNumberNull = {};

    _.each(_.range(bank.headers.firstYear, new Date().getFullYear()+1), (y) => {
      const m1 = (y === bank.headers.firstYear) ? bank.headers.firstMonth : 1;
      const m2 = (y === (new Date().getFullYear())) ? (new Date().getMonth() + 1) : 12;

      ybu[y] = [['Date', 'Goal', 'Done'], [new Date(y, 0, 1), 0, 0]]; 

      _.each(_.range(m1, m2 + 1), (m) => {
        svsi.push([
          new Date(y, m, 0), // last day of m-1
          _.get(bank.totalMonthSavings, [y, m], 0),
          _.get(bank.totalMonthIncome, [y, m], 0)
        ]);

        nws.push([
          new Date(y, m, 0),
          _.get(bank.networth, [y, m], null) as number|null,
          _.get(bank.totalHolding, [y, m], 0)
        ]);

        var sae_values = _(bank.savingsInputs)
          .filter((header) => (header.types.indexOf('T') === -1) || (header.type === 'T'))
          .map((header) => _.get(bank.grandTotalMonthInstitution, [y, m, header.id]))
          .value();

        sae.push([new Date(y, m, 0), ...sae_values]);

        const manual_expense = _.get(bank.expenses, [y, m], 0);
        const automatic_expenses = _.get(bank.totalMonthIncome, [y, m], 0) - _.get(bank.totalMonthSavings, [y, m], 0);

        if (_.get(bank.networth, [y, m])) {
          bep.push([
            new Date(y, m, 0), 
            Math.round(parseFloat(_.get(bank.networth, [y, m], '0')) / 300),
            manual_expense !== 0 ? manual_expense : Math.max(0, automatic_expenses)
          ]);
        }        
      });
      
      _.each(_.range(m1, 13), (m) => {
        ybu[y].push([
          new Date(y, m, 0),
          m * _.get(bank.monthlyGoal, y, 0),
          (m <= m2) ? m * _.get(bank.monthlyGoal, y, 0) + _.get(bank.goalYearToDate, [y, m], 0) : null
        ]);
      });
    });

    _(bank.savingsInputs).filter((header) => {
      return (header.types.indexOf('T') === -1) || (header.type === 'T');
    }).each((header) => {
      const h = _(bank.savingsHeaders).keyBy('id').get([header.id]);
      if (!h) return;

      let header_label = h.label || 'N/A';
      if (h.sublabel) header_label += ' > ' + h.sublabel;

      sb.push([header_label, {
        v: bank.grandTotalInstitution[header.id][header.type],
        f: '$' + helpers.amount(bank.grandTotalInstitution[header.id][header.type], true, true) 
      }]);
    });

    return {svsi, nws, sb, sae, bep, ybu};
  }
  
  const chartsBlock = (mobile: boolean, recap: IRecap) => (
    <>
      {type === CHARTS.URL.INCOME_VS_SAVINGS && <YearlyBreakdown chart={type} data={recap.svsi} mobile={mobile} {...props} />}
      {type === CHARTS.URL.NET_WORTH_VS_SAVINGS && <YearlyBreakdown chart={type} data={recap.nws} mobile={mobile} {...props} />}
      {type === CHARTS.URL.SAVINGS_BREAKDOWN && <Charts.SavingsBreakdownChart data={recap.sb} mobile={mobile} darkMode={props.darkMode} />}
      {type === CHARTS.URL.ALLOCATION_EVOLUTION && <YearlyBreakdown chart={type} data={recap.sae} mobile={mobile} {...props} />}
      {type === CHARTS.URL.BREAK_EVEN_POINT && <YearlyBreakdown chart={type} data={recap.bep} mobile={mobile} {...props} />}
      {type === CHARTS.URL.YEARLY_GOAL_BURNUP && <YearlyGoalBurnUpChart data={recap.ybu} mobile={mobile} chart={type} {...props} />}
      {type === CHARTS.URL.PROJECTION && <ProjectionChart mobile={mobile} chart={type} {...props} />}
    </>
  );

  if (!bankLoaded) return <LoadingPanel />;
  
  const recap = mapBankToRecap(bank);

  return (
    <>
      <Selector type={type} history={props.history} match={props.match} location={props.location} />
      <Container fluid className="top-shadow chart-container">
        <Row>
          <Col className="pl-0 pr-0">
            <Container>
              <Row>
                <Col>
                  <Mobile>
                    {chartsBlock(true, recap)}
                  </Mobile>
                  <NotMobile>
                    {chartsBlock(false, recap)}
                  </NotMobile>
                </Col>
              </Row> 
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}

const mapStateToProps = (state: AppState) => {
  return ({
    authUser: state.sessionState.authUser,
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded,
    darkMode: state.sessionState.darkMode,
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onLoadBank: (uid: string) => dispatch(loadBank(uid))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChartsPageBase);
