import React from 'react';
import { Row, Col } from 'reactstrap';
import helpers from '../../helpers';


interface IProps {
  result: number, 
  goal: number, 
  percentage: number, 
  label: string
}

interface IState {

}

export default class Progress extends React.Component<IProps, IState> {
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
          <Col>
            <div className="progress mb-2">
              <div className={`progress-bar ${result >= 0 ? 'bg-success' : 'bg-danger'}`}
                  role="progressbar" 
                  style={{width: percentage + '%'}}>
                {result + goal != 0 && '$'}
                {helpers.amount(result + goal, false, true)}
              </div>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
