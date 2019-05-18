import _ from 'lodash';
import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { LoadingPanel } from '../../components';
import { Mobile, NotMobile } from '../../components/Responsive';
import * as CHARTS from '../../constants/charts';
import helpers from '../../helpers';
import { AppState } from '../../store';
import * as Charts from './charts';
import Selector from './selector';
import YearlyChart from './yearlyChart';

interface IProps extends RouteComponentProps<{type: string}> {
  authUser: firebase.User|null;
  bank: Bank.IBank;
  bankLoaded: boolean;
}

interface IState {
  type: string;
}

type ArrayDateNumber = Array<Array<string>|Array<Date|number>>;
type YearlyArrayDateNumberNull = {[year:number]: Array<Array<string>|Array<Date|number|null>>};

interface IRecap {
  svsi: ArrayDateNumber;
  nw: ArrayDateNumber;
  ts: ArrayDateNumber;
  nws: ArrayDateNumber;
  sb: ArrayDateNumber;
  ae: ArrayDateNumber;
  bea: ArrayDateNumber;
  yb: YearlyArrayDateNumberNull
}

class ChartsPageBase extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props);

    this.state = {
      type: props.match.params.type || '',
    };
  }

  componentDidMount() {
    const { authUser, onLoadBank, bankLoaded }: any = this.props;
    if (!bankLoaded) onLoadBank(authUser.uid);
  }

  componentDidUpdate(prevProps: IProps, prevState: IState, snapshot: any) {
    if (this.state.type === (this.props.match.params.type || '')) return;
    this.setState({
      type: this.props.match.params.type || ''
    });
    this.mapBankToRecap(this.props.bank);
  }

  mapBankToRecap = (bank: Bank.IBank) => {
    const svsi: ArrayDateNumber = [['Date', 'Savings', 'Income']];
    const nw: ArrayDateNumber = [['Date', 'New worth']];
    const ts: ArrayDateNumber = [['Date', 'Savings']];
    const nws: ArrayDateNumber = [['Date', 'New worth', 'Savings']];
    const sb: ArrayDateNumber = [['Institution', 'Amount']];
    const ae: ArrayDateNumber = [_.concat(['Date'], _(bank.savingsInputs)
      .filter((header) => (header.types.indexOf('T') === -1) || (header.type === 'T'))
      .map((header) => _(bank.savingsHeaders).keyBy('id').get([header.id, 'label'], 'N/A'))
      .value()
    )];
    const bea: ArrayDateNumber = [['Date', 'Passive income', 'Expenses']];
    const yb: YearlyArrayDateNumberNull = {};

    _.each(_.range(bank.headers.firstYear, new Date().getFullYear()+1), (y) => {
      const m1 = (y === bank.headers.firstYear) ? bank.headers.firstMonth : 1;
      const m2 = (y === (new Date().getFullYear())) ? (new Date().getMonth() + 1) : 12;

      yb[y] = [['Date', 'Goal', 'Remaining'], [
        new Date(y, 0, 1), 
        12 * _.get(bank.monthlyGoal, y, 0),
        12 * _.get(bank.monthlyGoal, y, 0)
      ]]; 

      _.each(_.range(m1, m2 + 1), (m) => {
        svsi.push([
          new Date(y, m - 1), 
          _.get(bank.totalMonthSavings, [y, m], 0),
          _.get(bank.totalMonthIncome, [y, m], 0)
        ]);

        if (_.get(bank.networth, [y, m])) {
          nw.push([
            new Date(y, m - 1), 
            _.get(bank.networth, [y, m], 0)
          ]);
        }
        
        ts.push([
          new Date(y, m - 1),
          _.get(bank.totalHolding, [y, m], null)
        ]);

        if (_.get(bank.networth, [y, m])) {
          nws.push([
            new Date(y, m - 1), 
            _.get(bank.networth, [y, m], 0),
            _.get(bank.totalHolding, [y, m], 0)
          ]);
        }

        ae.push(_.concat([new Date(y, m - 1)], _(bank.savingsInputs)
          .filter((header) => (header.types.indexOf('T') === -1) || (header.type === 'T'))
          .map((header) => bank.grandTotalMonthInstitution[y][m][header.id])
          .value()
        ));

        const manual_expense = _.get(bank.expenses, [y, m], 0);
        const automatic_expenses = _.get(bank.totalMonthIncome, [y, m], 0) - _.get(bank.totalMonthSavings, [y, m], 0);

        if (_.get(bank.networth, [y, m])) {
          bea.push([
            new Date(y, m - 1), 
            Math.round(_.get(bank.networth, [y, m], 0) / 300),
            manual_expense != 0 ? manual_expense : Math.max(0, automatic_expenses)
          ]);
        }        
      });

      _.each(_.range(m1, 13), (m) => {
        yb[y].push([
          new Date(y, m, 0), // last day of m-1
          (12 - m) * _.get(bank.monthlyGoal, y, 0),
          (m <= m2) ? (12 - m) * _.get(bank.monthlyGoal, y, 0) - _.get(bank.goalYearToDate, [y, m], 0) : null
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

    return { 
      svsi: svsi, 
      nw, ts, nws, sb, ae, bea, yb 
    };
  }
  
  chartsBlock = (mobile: boolean, recap: IRecap) => {
    const { type } = this.state;

    return (
      <>                    
        {type === CHARTS.URL.INCOME_VS_SAVINGS && <Charts.IncomeVsSavingsChart data={recap.svsi} mobile={mobile} />}
        {type === CHARTS.URL.NET_WORTH && <Charts.NetWorthChart data={recap.nw} mobile={mobile} />}
        {type === CHARTS.URL.TOTAL_SAVINGS && <Charts.TotalSavingsChart data={recap.ts} mobile={mobile} />}
        {type === CHARTS.URL.NET_WORTH_VS_SAVINGS && <Charts.NetWorthVsSavingsChart data={recap.nws} mobile={mobile} />}
        {type === CHARTS.URL.SAVINGS_BREAKDOWN && <Charts.SavingsBreakdownChart data={recap.sb} mobile={mobile} />}
        {type === CHARTS.URL.ALLOCATION_EVOLUTION && <Charts.AllocationEvolutionChart data={recap.ae} mobile={mobile} />}
        {type === CHARTS.URL.BREAK_EVEN_ANALYSIS && <Charts.BreakEvenAnalysisChart data={recap.bea} mobile={mobile} />}
        {type === CHARTS.URL.YEARLY_GOAL_BURNDOWN && <YearlyChart data={recap.yb} mobile={mobile} chart={type} />}
      </>
    );
  }

  render() {    
    if (!this.props.bankLoaded) return <LoadingPanel />;
    
    const recap = this.mapBankToRecap(this.props.bank);

    return (
      <>
        <Selector type={this.state.type} history={this.props.history} />
        <Container fluid className="top-shadow">
          <Row>
            <Col className="pl-0 pr-0">
              <Container>
                <Row>
                  <Col>
                    <Mobile>                    
                      {this.chartsBlock(true, recap)}
                    </Mobile>
                    <NotMobile>
                      {this.chartsBlock(false, recap)}
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
)(ChartsPageBase);
