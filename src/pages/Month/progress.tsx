import React from 'react';
import { Col, Progress as ProgressRS, Row } from 'reactstrap';

import helpers from '../../helpers';

interface IProps {
  result: number, 
  goal: number, 
  percentage: number, 
  label: string
}

export default class Progress extends React.Component<IProps, {}> {
  render () {
    const { result, goal, percentage, label } = this.props

    return (
      <React.Fragment>
        <Row>
          <Col>
            <span>{label}</span>
          </Col>
          <Col className="text-right">
            {result != 0 && <span className={result >= 0 ? 'text-success':'text-danger'}>
              ${helpers.amount(Math.abs(result), false, true)} 
              &nbsp;
              {result > 0 ? 'over' : 'left'}
            </span>}
          </Col>
        </Row>
        <Row>
          <Col className="mb-2">
            <ProgressRS value={percentage} color={result >= 0 ? 'success' : 'danger'}>
              {result + goal != 0 && '$'}
              {helpers.amount(result + goal, false, true)}
            </ProgressRS>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
