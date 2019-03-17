import React from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { Bank } from '../../bank';
import * as ROUTES from '../../constants/routes';
import LoadingPanel from '../../components/LoadingPanel';
import HeaderPanel from './headerPanel';
import { NavLink } from 'react-router-dom';
import helpers from '../../helpers';


interface IState {
  loading: boolean,
  bank: Bank
}

export default class DashboardPageBase extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: true,
      bank: new Bank()
    }
  }

  componentDidMount() {
    this.state.bank.load().then(() => {
      this.setState({bank: this.state.bank, loading: false});
    }).catch(function(error) {
    });
  }

  render() {
    const { loading, bank } = this.state;

    return (
      <React.Fragment>
        {loading && <LoadingPanel />}
        {!loading && <HeaderPanel />}
        {!loading && <Container>
          <Row>
            <Col>
              <ListGroup flush>
                {bank.lastupdate.netWorth && <ListGroupItem>
                  <NavLink to={helpers.currentMonthRoute()}>Net worth</NavLink>
                  <span className="pull-right">
                    Last update <b>{bank.lastupdate.netWorth}</b>
                  </span>
                </ListGroupItem>}
                {bank.lastupdate.savings && <ListGroupItem>
                  <NavLink to={ROUTES.SAVINGS}>Savings</NavLink>
                  <span className="pull-right">
                    Last update <b>{bank.lastupdate.savings}</b>
                  </span>
                </ListGroupItem>}
                {bank.lastupdate.income && <ListGroupItem>
                  <NavLink to={ROUTES.REVENUES}>Revenues</NavLink>
                  <span className="pull-right">
                    Last update <b>{bank.lastupdate.income}</b>
                  </span>
                </ListGroupItem>}
                {bank.lastupdate.headers && <ListGroupItem>
                  <NavLink to={ROUTES.SETTINGS}>Settings</NavLink>
                  <span className="pull-right">
                    Last update <b>{bank.lastupdate.headers}</b>
                  </span>
                </ListGroupItem>}
              </ListGroup>
            </Col>
          </Row>
        </Container>}
      </React.Fragment>
    );
  }
}
