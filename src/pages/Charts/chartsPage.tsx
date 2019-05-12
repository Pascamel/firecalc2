import React from 'react';
import { connect } from 'react-redux';
import { loadBank } from '../../actions'; //  '../../actions';
import { Container, Row, Col } from 'reactstrap';
import { RouteComponentProps } from 'react-router-dom';
import _ from 'lodash';
import { Bank } from '../../bank';
import helpers from '../../helpers';
import * as CHARTS from '../../constants/charts';
import Selector from './selector';
import { Mobile, NotMobile } from '../../components/Responsive';
import { LoadingPanel } from '../../components';
import * as Charts from './charts';


interface IProps extends RouteComponentProps<{type: string}> {
  authUser: firebase.User|null,
  bank: Bank,
  bankLoaded: boolean
}

interface IState {
  type: string
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
    
    const svsi: any = [['Date', 'Savings', 'Income']];
    const nw: any = [['Date', 'New worth']];
    const ts: any = [['Date', 'Savings']];
    const nws: any = [['Date', 'New worth', 'Savings']];
    const sb: any = [['Institution', 'Amount']];
    const ae: any = [_.concat(['Date'], _(bank.savingsInputs)
      .filter((header) => (header.types.indexOf('T') === -1) || (header.type === 'T'))
      .map((header) => _(bank.savingsHeaders).keyBy('id').get([header.id, 'label'], 'N/A'))
      .value()
    )]; 

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

    return (
      <React.Fragment>

        <Selector type={type} history={this.props.history} />}
        <Container fluid className="top-shadow">
          <Row>
            <Col className="pl-0 pr-0">
              <Container>
                <Row>
                  <Col>
                    <Mobile>                    
                      {type === CHARTS.URL.INCOME_VS_SAVINGS && <Charts.IncomeVsSavingsChart data={svsi} mobile={true} />}
                      {type === CHARTS.URL.NET_WORTH && <Charts.NetWorthChart data={nw} mobile={true} />}
                      {type === CHARTS.URL.TOTAL_SAVINGS && <Charts.TotalSavingsChart data={ts} mobile={true} />}
                      {type === CHARTS.URL.NET_WORTH_VS_SAVINGS && <Charts.NetWorthVsSavingsChart data={nws} mobile={true} />}
                      {type === CHARTS.URL.SAVINGS_BREAKDOWN && <Charts.SavingsBreakdownChart data={sb} mobile={true} />}
                      {type === CHARTS.URL.ALLOCATION_EVOLUTION && <Charts.AllocationEvolutionChart data={ae} mobile={true} />}
                    </Mobile>
                    <NotMobile>
                      {type === CHARTS.URL.INCOME_VS_SAVINGS && <Charts.IncomeVsSavingsChart data={svsi} mobile={false} />}
                      {type === CHARTS.URL.NET_WORTH && <Charts.NetWorthChart data={nw} mobile={false} />}
                      {type === CHARTS.URL.TOTAL_SAVINGS && <Charts.TotalSavingsChart data={ts} mobile={false} />}
                      {type === CHARTS.URL.NET_WORTH_VS_SAVINGS && <Charts.NetWorthVsSavingsChart data={nws} mobile={false} />}
                      {type === CHARTS.URL.SAVINGS_BREAKDOWN && <Charts.SavingsBreakdownChart data={sb} mobile={false} />}
                      {type === CHARTS.URL.ALLOCATION_EVOLUTION && <Charts.AllocationEvolutionChart data={ae} mobile={false} />}
                    </NotMobile>
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

const mapStateToProps = (state: any) => {
  return ({
    authUser: state.sessionState.authUser,
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded
  });
}

const mapDispatchToProps = (dispatch: any) => {
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
