import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { RouteComponentProps } from 'react-router-dom';
import _ from 'lodash';
import * as CHARTS from '../../constants/charts';
import { Bank } from '../../bank';
import helpers from '../../helpers';
import Selector from './selector';
import LoadingPanel from '../../components/LoadingPanel';
import { IncomeVsSavingsChart, NetWorthChart, TotalSavingsChart, SavingsBreakdownChart } from './charts';


interface IProps extends RouteComponentProps<{type: string}> {}

interface IState {
  loading: boolean,
  bank: Bank,
  type: string,
  savings_vs_income: any,
  net_worth: any
  total_savings: any,
  savings_breakdown: any
}

export default class StatsBase extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props);

    this.state = {
      loading: true,
      bank: new Bank(),
      type: props.match.params.type || '',
      savings_vs_income: [],
      net_worth: [],
      total_savings: [],
      savings_breakdown: []
    };
  }

  componentDidMount() {
    this.state.bank.load().then(() => {
      const svsi: any = [['Date', 'Savings', 'Income']];
      const nw: any = [['Data', 'New worth']];
      const ts: any = [['Data', 'Savings']];
      const sb: any = [['Institution', 'Amount']];

      _.each(_.range(this.state.bank.headers.firstYear, new Date().getFullYear()+1), y => {
        const m1 = (y === this.state.bank.headers.firstYear) ? this.state.bank.headers.firstMonth : 1;
        const m2 = (y === (new Date().getFullYear())) ? (new Date().getMonth() + 1) : 12;
        _.each(_.range(m1, m2 + 1), m => {
          svsi.push([
            new Date(y, m), 
            _.get(this.state.bank.totalMonthSavings, [y, m], 0),
            _.get(this.state.bank.totalMonthIncome, [y, m], 0)
          ]);
          nw.push([
            new Date(y, m), 
            _.get(this.state.bank.networth, [y, m], 0)
          ]);
          ts.push([
            new Date(y, m), 
            _.get(this.state.bank.totalHolding, [y, m], 0)
          ]);
        });
      });

      _(this.state.bank.savingsInputs).filter((header) => {
        return (header.types.indexOf('T') === -1) || (header.type === 'T');
      }).each((header) => {
        const h = _(this.state.bank.savingsHeaders).keyBy('id').get([header.id]);
        if (!h) return;

        let header_label = h.label || 'N/A';
        if (h.sublabel) header_label += ' > ' + h.sublabel;

        sb.push([header_label, {
          v: this.state.bank.grandTotalInstitution[header.id][header.type],
          f: '$' + helpers.amount(this.state.bank.grandTotalInstitution[header.id][header.type], true, true) 
        }]);
      });
      
      this.setState({
        bank: this.state.bank, 
        loading: false,
        savings_vs_income: svsi,
        net_worth: nw,
        total_savings: ts,
        savings_breakdown: sb
      });
    });
  }

  componentDidUpdate(prevProps: IProps, prevState: IState, snapshot: any) {
    if (this.state.type === (this.props.match.params.type || '')) return;
    this.setState({
      type: this.props.match.params.type || ''
    });
  }
  
  render() {
    const { loading, type } = this.state;
    return (
      <React.Fragment>
        <Selector type={type} />
        {loading && <LoadingPanel />}
        {!loading && <Container>
          <Row>
            <Col>
              {type === CHARTS.URL.INCOME_VS_SAVINGS && <IncomeVsSavingsChart data={this.state.savings_vs_income} />}
              {type === CHARTS.URL.NET_WORTH && <NetWorthChart data={this.state.net_worth} />}
              {type === CHARTS.URL.TOTAL_SAVINGS && <TotalSavingsChart data={this.state.total_savings} />}
              {type === CHARTS.URL.SAVINGS_BREAKDOWN && <SavingsBreakdownChart data={this.state.savings_breakdown} />}
            </Col>
          </Row>
        </Container>}
      </React.Fragment>
    );
  }
}
