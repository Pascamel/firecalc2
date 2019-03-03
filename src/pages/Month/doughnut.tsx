import React, { Component } from 'react';
import { Col } from 'reactstrap';
import {Doughnut as DoughnutLib} from 'react-chartjs-2';


interface IProps {
  savingRate: number
}

interface IState {

}

export default class Doughnut extends Component<IProps, IState> {
  options: any;

  constructor (props: IProps) {
    super(props);

    this.options = {
      cutoutPercentage: 70,
      tooltips: {
        enabled: false
      }
    };
  }

  render() {
    const data = {
      datasets: [{
        data: [
          Math.min(100, Math.max(0, this.props.savingRate * 100)), 
          100 - Math.min(100, Math.max(0, this.props.savingRate * 100))
        ],
        backgroundColor: ['#4267b2', '#f5f5f5'],
        hoverBackgroundColor: ['#4267b2', '#f5f5f5'],
        borderWidth: [0, 0],
        hoverBorderWidth: [0, 0]
      }]
    };

    return (
      <Col className="col-6 chart-container">
        <DoughnutLib data={data} height={300} options={this.options}/>
        <span className="chart-label">{Math.round(this.props.savingRate * 100)}%</span>
      </Col>
    );
  }
}
