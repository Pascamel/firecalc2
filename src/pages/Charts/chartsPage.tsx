import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { RouteComponentProps } from 'react-router-dom';
import _ from 'lodash';
import { Bank } from '../../bank';
import helpers from '../../helpers';
import * as CHARTS from '../../constants/charts';
import Selector from './selector';
import { LoadingPanel } from '../../components';
import { 
  IncomeVsSavingsChart, 
  NetWorthChart, 
  TotalSavingsChart, 
  NetWorthVsSavingsChart, 
  SavingsBreakdownChart, 
  AllocationEvolutionChart 
} from './charts';
import Header from '../Revenues/header';


interface IProps extends RouteComponentProps<{type: string}> {}

interface IState {
  loading: boolean,
  bank: Bank,
  type: string,
  savings_vs_income: any,
  net_worth: any
  total_savings: any,
  net_worth_vs_savings: any,
  savings_breakdown: any,
  allocation_evolution: any

}

export default class ChartsPageBase extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props);

    this.state = {
      loading: true,
      bank: new Bank(),
      type: props.match.params.type || '',
      savings_vs_income: [],
      net_worth: [],
      total_savings: [],
      net_worth_vs_savings: [],
      savings_breakdown: [],
      allocation_evolution: []
    };
  }

  componentDidMount() {
    this.state.bank.load().then(() => {
      const svsi: any = [['Date', 'Savings', 'Income']];
      const nw: any = [['Date', 'New worth']];
      const ts: any = [['Date', 'Savings']];
      const nws: any = [['Date', 'New worth', 'Savings']];
      const sb: any = [['Institution', 'Amount']];
      const ae: any = [_.concat(['Date'], _(this.state.bank.savingsInputs)
        .filter((header) => (header.types.indexOf('T') === -1) || (header.type === 'T'))
        .map((header) => _(this.state.bank.savingsHeaders).keyBy('id').get([header.id, 'label'], 'N/A'))
        .value()
      )]; 

      _.each(_.range(this.state.bank.headers.firstYear, new Date().getFullYear()+1), (y) => {
        const m1 = (y === this.state.bank.headers.firstYear) ? this.state.bank.headers.firstMonth : 1;
        const m2 = (y === (new Date().getFullYear())) ? (new Date().getMonth() + 1) : 12;
        _.each(_.range(m1, m2 + 1), (m) => {
          svsi.push([
            new Date(y, m - 1), 
            _.get(this.state.bank.totalMonthSavings, [y, m], 0),
            _.get(this.state.bank.totalMonthIncome, [y, m], 0)
          ]);

          if (_.get(this.state.bank.networth, [y, m])) {
            nw.push([
              new Date(y, m - 1), 
              _.get(this.state.bank.networth, [y, m], 0)
            ]);
          }
          
          ts.push([
            new Date(y, m - 1),
            _.get(this.state.bank.totalHolding, [y, m], null)
          ]);

          if (_.get(this.state.bank.networth, [y, m])) {
            nws.push([
              new Date(y, m - 1), 
              _.get(this.state.bank.networth, [y, m], 0),
              _.get(this.state.bank.totalHolding, [y, m], 0)
            ]);
          }

          let ae1: any = _.concat([new Date(y, m - 1)], _(this.state.bank.savingsInputs)
            .filter((header) => (header.types.indexOf('T') === -1) || (header.type === 'T'))
            .map((header) => this.state.bank.grandTotalMonthInstitution[y][m][header.id])
            .value()
          );
          ae.push(ae1);
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
        net_worth_vs_savings: nws,
        savings_breakdown: sb,
        allocation_evolution: ae
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
        {loading && <LoadingPanel />}
        {!loading && <Selector type={type} history={this.props.history} />}
        {!loading && <Container fluid className="top-shadow">
          <Row>
            <Col>
              <Container>
                <Row>
                  <Col>
                    {type === CHARTS.URL.INCOME_VS_SAVINGS && <IncomeVsSavingsChart data={this.state.savings_vs_income} />}
                    {type === CHARTS.URL.NET_WORTH && <NetWorthChart data={this.state.net_worth} />}
                    {type === CHARTS.URL.TOTAL_SAVINGS && <TotalSavingsChart data={this.state.total_savings} />}
                    {type === CHARTS.URL.NET_WORTH_VS_SAVINGS && <NetWorthVsSavingsChart data={this.state.net_worth_vs_savings} />}
                    {type === CHARTS.URL.SAVINGS_BREAKDOWN && <SavingsBreakdownChart data={this.state.savings_breakdown} />}
                    {type === CHARTS.URL.ALLOCATION_EVOLUTION && <AllocationEvolutionChart data={this.state.allocation_evolution} />}
                  </Col>
                </Row> 
              </Container>
            </Col>
          </Row>
        </Container>}
      </React.Fragment>
    );
  }
}
