import React from 'react';
import { Doughnut as DoughnutLib } from 'react-chartjs-2';
import { connect } from 'react-redux';

import { AppState } from '../../store';

interface IProps {
  savingRate: number
  darkMode: boolean;
}

const Doughnut = (props: IProps) => {
  const { savingRate } = props;
  const options = {
    cutoutPercentage: 70,
    tooltips: {
      enabled: false
    }
  };

  const successColor = props.darkMode ? '#00bc8c': '#66bb6a';
  const failureColor = props.darkMode ? '#e74b6c' : '#e62154';
  const backgroundColor = props.darkMode ? '#3a3a3a' : '#ddd';

  const data = {
    datasets: [{
      data: [
        Math.min(100, Math.max(0, savingRate * 100)), 
        100 - Math.min(100, Math.max(0, savingRate * 100))
      ],
      backgroundColor: [savingRate > .5 ? successColor : failureColor, backgroundColor],
      hoverBackgroundColor: [savingRate > .5 ? successColor : failureColor, backgroundColor],
      borderWidth: [0, 0],
      hoverBorderWidth: [0, 0]
    }]
  };

  return (
    <>
      <DoughnutLib data={data} height={300} options={options}/>
      <span className="chart-label">{Math.round(savingRate * 100)}%</span>
    </>
  );
}

const mapStateToProps = (state: AppState) => {
  return ({
    darkMode: state.sessionState.darkMode,
  });
}

export default connect(mapStateToProps)(Doughnut);
