import React from 'react';
import { Doughnut as DoughnutLib } from 'react-chartjs-2';

interface IProps {
  savingRate: number
}

export default class Doughnut extends React.Component<IProps, {}> {
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
        backgroundColor: [this.props.savingRate > .5 ? '#66bb6a' : '#e62154', '#ddd'],
        hoverBackgroundColor: [this.props.savingRate > .5 ? '#66bb6a' : '#e62154', '#ddd'],
        borderWidth: [0, 0],
        hoverBorderWidth: [0, 0]
      }]
    };

    return (
      <React.Fragment>
        <DoughnutLib data={data} height={300} options={this.options}/>
        <span className="chart-label">{Math.round(this.props.savingRate * 100)}%</span>
      </React.Fragment>
    );
  }
}
