import _ from 'lodash';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { ListGroup, ListGroupItem } from 'reactstrap';

import { NavButtonGroup } from '../../components';
import CHARTS from '../../constants/charts';
import ROUTES from '../../constants/routes';

interface IProps {
  type: string;
}

const Selector = ({ type, history }: IProps & RouteComponentProps) => {
  const chartsArray = Object.values(CHARTS);

  const goTo = (type: string) => {
    const route = ROUTES.CHARTS.replace(':type', type);
    history.push(route);
  };

  const prevChart = () => {
    const index = chartsArray.findIndex((chart) => chart.URL === type);
    const newIndex = (index + chartsArray.length - 1) % chartsArray.length;
    const newRoute = chartsArray[newIndex].URL;

    history.push(ROUTES.CHARTS.replace(':type', newRoute));
  };

  const nextChart = () => {
    const index = chartsArray.findIndex((chart) => chart.URL === type);
    const newIndex = (index + 1) % chartsArray.length;
    const newRoute = chartsArray[newIndex].URL;

    history.push(ROUTES.CHARTS.replace(':type', newRoute));
  };

  return (
    <>
      <ListGroup className="d-none d-sm-block">
        {chartsArray.map((chart, key: number) => (
          <ListGroupItem
            key={key}
            className="text-left cursor nowrap-ellipsis"
            color={type === chart.URL ? 'primary' : 'darker'}
            onClick={() => goTo(chart.URL)}
          >
            {chart.label}
          </ListGroupItem>
        ))}
      </ListGroup>
      <NavButtonGroup
        className="d-inline-blick d-sm-none"
        color="light"
        button-color="outline-secondary"
        on-click={[prevChart, nextChart]}
        label={_(chartsArray).keyBy('URL').get(type).label}
      />
    </>
  );
};

export default Selector;
