import React from 'react';
import { connect } from 'react-redux';
import { Badge, Button, ButtonGroup, Col, ListGroup, ListGroupItem, Row } from 'reactstrap';

import Bank from '../../bank';
import * as CHARTS from '../../constants/charts';
import helpers from '../../helpers';
import { AppState } from '../../store';
import * as Charts from './charts';

interface IProps {
  bank: Bank.IBank;
  data: {[year: number]: Array<Array<string>|Array<Date|number|null>>};
  mobile: boolean; 
  chart: string
}

interface IState {
  year: number;
}

class YearlyChart extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      year: new Date().getFullYear()
    }
  }

  clickDate = (year: number) => {
    this.setState({year: year});
  }

  percentageYear = (year: string) => {
    const { bank } = this.props;
    const month = (parseInt(year) === (new Date().getFullYear())) ? (new Date().getMonth() + 1) : 12;

    return bank.goalYearToDate[year][month] / bank.monthlyGoal[year] / 12
  }
  
  render() {
    const { data, mobile, chart } = this.props;
    const { year } = this.state;
    
    return (
      <Row>
        <Col md={2} sm={12}>
          {!mobile && <ListGroup>
            {Object.entries(data).map((y) => ( 
              <ListGroupItem key={y[0]} className="text-left" color={parseInt(y[0]) === year ? 'secondary' : 'link'} tag={Button} onClick={() => this.clickDate(parseInt(y[0]))}>
                {y[0]}
                <Badge color="success" pill className="pull-right mt-1">
                  {helpers.percentage(this.percentageYear(y[0]), 0, true)}
                </Badge>
              </ListGroupItem>
            ))} 
          </ListGroup>}
          {mobile && <ButtonGroup >
            <Button>
              Left
              <Badge pill>14</Badge>
            </Button>
            <Button>Middle</Button>
            <Button>Right</Button>
          </ButtonGroup>}
        </Col>
        <Col md={10} sm={12}>
          {chart === CHARTS.URL.YEARLY_GOAL_BURNDOWN && <Charts.YearlyGoalBurnDown 
            data={data[year]} 
            mobile={mobile} year={this.state.year} />}
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank,
  });
}

export default connect(mapStateToProps)(YearlyChart);
