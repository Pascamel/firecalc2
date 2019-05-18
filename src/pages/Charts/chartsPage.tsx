import _ from 'lodash';
import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import { loadBank } from '../../actions';
import * as Bank from '../../bank';
import { LoadingPanel } from '../../components';
import { Mobile, NotMobile } from '../../components/Responsive';
import * as CHARTS from '../../constants/charts';
import helpers from '../../helpers';
import { AppState } from '../../store';
import * as Charts from './charts';
import Selector from './selector';

interface IProps extends RouteComponentProps<{type: string}> {
  authUser: firebase.User|null;
  bank: Bank.IBank;
  bankLoaded: boolean;
}

interface IState {
  type: string;
}

class ChartsPageBase extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props);

    this.state = {
      type: props.match.params.type || ''
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
  }
  
  render() {
    const { type } = this.state;
    const { bank, bankLoaded } = this.props;

    if (!bankLoaded) return <LoadingPanel />;
    
    const svsi: Array<Array<string>|Array<Date|number>> = [['Date', 'Savings', 'Income']];
    const nw: Array<Array<string>|Array<Date|number>> = [['Date', 'New worth']];
    const ts: Array<Array<string>|Array<Date|number>> = [['Date', 'Savings']];
    const nws: Array<Array<string>|Array<Date|number>> = [['Date', 'New worth', 'Savings']];
    const sb: Array<Array<string>|Array<Date|number>> = [['Institution', 'Amount']];
    const ae: Array<Array<string>|Array<Date|number>> = [_.concat(['Date'], _(bank.savingsInputs)
      .filter((header) => (header.types.indexOf('T') === -1) || (header.type === 'T'))
      .map((header) => _(bank.savingsHeaders).keyBy('id').get([header.id, 'label'], 'N/A'))
      .value()
    )];
    const bea: Array<Array<string>|Array<Date|number>> = [['Date', 'Passive income', 'Expenses']];

    _.each(_.range(bank.headers.firstYear, new Date().getFullYear()+1), (y) => {
      const m1 = (y === bank.headers.firstYear) ? bank.headers.firstMonth : 1;
      const m2 = (y === (new Date().getFullYear())) ? (new Date().getMonth() + 1) : 12;
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

        let ae1: any = _.concat([new Date(y, m - 1)], _(bank.savingsInputs)
          .filter((header) => (header.types.indexOf('T') === -1) || (header.type === 'T'))
          .map((header) => bank.grandTotalMonthInstitution[y][m][header.id])
          .value()
        );
        ae.push(ae1);

        if (_.get(bank.networth, [y, m])) {
          bea.push([
            new Date(y, m - 1), 
            Math.round(_.get(bank.networth, [y, m], 0) / 300),
            Math.max(0, _.get(bank.totalMonthIncome, [y, m], 0) - _.get(bank.totalMonthSavings, [y, m], 0))
          ]);
        }
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

    const chartsBlock = (mobile: boolean) => {
      return (
        <>                    
          {type === CHARTS.URL.INCOME_VS_SAVINGS && <Charts.IncomeVsSavingsChart data={svsi} mobile={mobile} />}
          {type === CHARTS.URL.NET_WORTH && <Charts.NetWorthChart data={nw} mobile={mobile} />}
          {type === CHARTS.URL.TOTAL_SAVINGS && <Charts.TotalSavingsChart data={ts} mobile={mobile} />}
          {type === CHARTS.URL.NET_WORTH_VS_SAVINGS && <Charts.NetWorthVsSavingsChart data={nws} mobile={mobile} />}
          {type === CHARTS.URL.SAVINGS_BREAKDOWN && <Charts.SavingsBreakdownChart data={sb} mobile={mobile} />}
          {type === CHARTS.URL.ALLOCATION_EVOLUTION && <Charts.AllocationEvolutionChart data={ae} mobile={mobile} />}
          {type === CHARTS.URL.BREAK_EVEN_ANALYSIS && <Charts.BreakEvenAnalysisChart data={bea} mobile={mobile} />}
        </>
      );
    }

    return (
      <>
        <Selector type={type} history={this.props.history} />
        <Container fluid className="top-shadow">
          <Row>
            <Col className="pl-0 pr-0">
              <Container>
                <Row>
                  <Col>
                    <Mobile>                    
                      {chartsBlock(true)}
                    </Mobile>
                    <NotMobile>
                      {chartsBlock(false)}
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
