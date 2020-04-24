import _ from 'lodash';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { ListGroup, ListGroupItem } from 'reactstrap';

import { Mobile, NavButtonGroup, NotMobile } from '../../components';
import * as CHARTS from '../../constants/charts';
import ROUTES from '../../constants/routes';

interface IProps {
  type: string;
}

const Selector = ({ type, history }: IProps & RouteComponentProps) => {
  const goTo = (type: string) => {
    const route = ROUTES.CHARTS.replace(':type', _.get(CHARTS.URL, type));
    history.push(route);
  };

  const prevChart = () => {
    const newIndex =
      (_.values(CHARTS.URL).indexOf(type) + _.keys(CHARTS.URL).length - 1) %
      _.keys(CHARTS.URL).length;
    const newRoute = _.get(CHARTS.URL, _.get(_.keys(CHARTS.URL), newIndex));

    history.push(ROUTES.CHARTS.replace(':type', newRoute));
  };

  const nextChart = () => {
    const newIndex =
      (_.values(CHARTS.URL).indexOf(type) + _.keys(CHARTS.URL).length + 1) %
      _.keys(CHARTS.URL).length;
    const newRoute = _.get(CHARTS.URL, _.get(_.keys(CHARTS.URL), newIndex));

    history.push(ROUTES.CHARTS.replace(':type', newRoute));
  };

  return (
    <>
      <NotMobile>
        <ListGroup>
          {Object.entries(CHARTS.URL).map((t, key: number) => (
            <ListGroupItem
              key={key}
              className="text-left cursor"
              color={type === t[1] ? 'primary' : 'darker'}
              onClick={() => goTo(t[0])}
            >
              {_.get(CHARTS.LABELS, t[0])}
            </ListGroupItem>
          ))}
        </ListGroup>
      </NotMobile>
      <Mobile>
        <NavButtonGroup
          color="light"
          button-color="outline-secondary"
          on-click={[prevChart, nextChart]}
          label={_.get(
            _.values(CHARTS.LABELS),
            _.values(CHARTS.URL).indexOf(type)
          )}
        />
      </Mobile>
    </>
  );
};

export default Selector;
