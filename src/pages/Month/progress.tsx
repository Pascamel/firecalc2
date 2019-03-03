import React, { Component } from 'react';
import helpers from '../../helpers';


interface IProps {
  result: number, 
  goal: number, 
  percentage: number, 
  label: string
}

interface IState {

}

export default class Progress extends Component<IProps, IState> {
  render () {
    const { result, goal, percentage, label } = this.props

    return (
      <React.Fragment>
        <div className="row">
          <div className="col">
            <span>{label}</span>
          </div>
          <div className="col text-right">
            <span className={`${result >= 0 ? 'text-success':'text-danger'} ${helpers.hideIf(result === 0)}`}>
              ${helpers.amount(Math.abs(result), false, true)} 
              &nbsp;
              {result > 0 ? 'over' : 'left'}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="progress mb-2">
              <div className={`progress-bar ${result >= 0 ? 'bg-success' : 'bg-danger'}`}
                  role="progressbar" 
                  style={{width: percentage + '%'}}>
                ${helpers.amount(result + goal, false, true)}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
