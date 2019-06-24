import React from 'react';
import { Doughnut as DoughnutLib } from 'react-chartjs-2';

interface IProps {
  savingRate: number
}

const Doughnut = (props: IProps) => {
  const { savingRate } = props;
  const options = {
    cutoutPercentage: 70,
    tooltips: {
      enabled: false
    }
  };

  const data = {
    datasets: [{
      data: [
        Math.min(100, Math.max(0, savingRate * 100)), 
        100 - Math.min(100, Math.max(0, savingRate * 100))
      ],
      backgroundColor: [savingRate > .5 ? '#66bb6a' : '#e62154', '#ddd'],
      hoverBackgroundColor: [savingRate > .5 ? '#66bb6a' : '#e62154', '#ddd'],
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

export default Doughnut;
