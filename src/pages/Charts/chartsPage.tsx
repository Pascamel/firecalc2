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
import ProjectionChart from './projectionChart';
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
  nws: ArrayDateNumber;
  sb: ArrayDateNumber;
  sae: ArrayDateNumber;
  bep: ArrayDateNumber;
  ybu: YearlyArrayDateNumberNull
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
    if (bankLoaded || !authUser ) return;
    
    onLoadBank(authUser.uid);
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
    const nws: ArrayDateNumber = [['Date', 'Net Worth', 'Savings']];
    const sb: ArrayDateNumber = [['Institution', 'Amount']];
    const sae: ArrayDateNumber = [_.concat(['Date'], _(bank.savingsInputs)
      .filter((header) => (header.types.indexOf('T') === -1) || (header.type === 'T'))
      .map((header) => _(bank.savingsHeaders).keyBy('id').get([header.id, 'label'], 'N/A'))
      .value()
    )];
    const bep: ArrayDateNumber = [['Date', 'Passive income', 'Expenses']];
    const ybu: YearlyArrayDateNumberNull = {};

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
          _.get(bank.networth, [y, m], null),
          _.get(bank.totalHolding, [y, m], 0)
        ]);

        sae.push(
          _.concat([new Date(y, m, 0)],
          _(bank.savingsInputs)
            .filter((header) => (header.types.indexOf('T') === -1) || (header.type === 'T'))
            .map((header) => bank.grandTotalMonthInstitution[y][m][header.id])
            .value()
        ));

        const manual_expense = _.get(bank.expenses, [y, m], 0);
        const automatic_expenses = _.get(bank.totalMonthIncome, [y, m], 0) - _.get(bank.totalMonthSavings, [y, m], 0);

        if (_.get(bank.networth, [y, m])) {
          bep.push([
            new Date(y, m, 0), 
            Math.round(_.get(bank.networth, [y, m], 0) / 300),
            manual_expense != 0 ? manual_expense : Math.max(0, automatic_expenses)
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
  
  chartsBlock = (mobile: boolean, recap: IRecap) => {
    const { type } = this.state;

    return (
      <>                    
        {type === CHARTS.URL.INCOME_VS_SAVINGS && <Charts.IncomeVsSavingsChart data={recap.svsi} mobile={mobile} />}
        {type === CHARTS.URL.NET_WORTH_VS_SAVINGS && <Charts.NetWorthVsSavingsChart data={recap.nws} mobile={mobile} />}
        {type === CHARTS.URL.SAVINGS_BREAKDOWN && <Charts.SavingsBreakdownChart data={recap.sb} mobile={mobile} />}
        {type === CHARTS.URL.ALLOCATION_EVOLUTION && <Charts.AllocationEvolutionChart data={recap.sae} mobile={mobile} />}
        {type === CHARTS.URL.BREAK_EVEN_POINT && <Charts.BreakEvenPointChart data={recap.bep} mobile={mobile} />}
        {type === CHARTS.URL.YEARLY_GOAL_BURNUP && <YearlyChart data={recap.ybu} mobile={mobile} chart={type} />}
        {type === CHARTS.URL.PROJECTION && <ProjectionChart mobile={mobile} chart={type} />}
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
    onLoadBank: (uid: string) => dispatch(loadBank(uid))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChartsPageBase);
