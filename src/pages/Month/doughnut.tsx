import React from 'react';
import { Doughnut as DoughnutLib } from 'react-chartjs-2';
import { connect } from 'react-redux';

import { Text } from '../../components';
import { AppState } from '../../store';

interface IProps {
  savingRate: number;
  darkMode: boolean;
}

const Doughnut = ({ darkMode, savingRate }: IProps) => {
  const options = {
    cutoutPercentage: 70,
    tooltips: {
      enabled: false
    }
  };

  const successColor = darkMode ? '#008958' : '#66bb6a';
  const failureColor = darkMode ? '#c12546' : '#e62154';
  const backgroundColor = darkMode ? '#3a3a3a' : '#ddd';

  const data = {
    datasets: [
      {
        data: [
          Math.min(100, Math.max(0, savingRate * 100)),
          100 - Math.min(100, Math.max(0, savingRate * 100))
        ],
        backgroundColor: [
          savingRate > 0.5 ? successColor : failureColor,
          backgroundColor
        ],
        hoverBackgroundColor: [
          savingRate > 0.5 ? successColor : failureColor,
          backgroundColor
        ],
        borderWidth: [0, 0],
        hoverBorderWidth: [0, 0]
      }
    ]
  };

  return (
    <>
      <DoughnutLib data={data} height={300} options={options} />
      <Text className="chart-label">{`${Math.round(savingRate * 100)}%`}</Text>
    </>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    darkMode: state.sessionState.darkMode
  };
};

export default connect(mapStateToProps)(Doughnut);
