import _ from 'lodash';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, ButtonGroup, Col, Container, Row } from 'reactstrap';

import { Icon, Mobile, NotMobile, Text } from '../../components';
import * as CHARTS from '../../constants/charts';
import ROUTES from '../../constants/routes';

interface IProps {
  type: string;
}

const ChartSelector = ({ type, history }: IProps & RouteComponentProps) => {
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
    <Container fluid className="alert alert-save alert-header">
      <Row>
        <Col className="pl-0 pr-0">
          <Container>
            <Row>
              <Col className="text-center">
                <NotMobile>
                  <ButtonGroup>
                    {Object.entries(CHARTS.URL).map((t, key: number) => (
                      <Button
                        color="link"
                        key={key}
                        disabled={type === t[1]}
                        onClick={() => goTo(t[0])}
                      >
                        {_.get(CHARTS.LABELS, t[0])}
                      </Button>
                    ))}
                  </ButtonGroup>
                </NotMobile>
                <Mobile>
                  <Button
                    color="outline-light"
                    className="pull-left"
                    onClick={prevChart}
                  >
                    <Icon icon="backward" />
                  </Button>
                  <Text>
                    {_.get(
                      _.values(CHARTS.LABELS),
                      _.values(CHARTS.URL).indexOf(type)
                    )}
                  </Text>
                  <Button
                    color="outline-light"
                    className="pull-right"
                    onClick={nextChart}
                  >
                    <Icon icon="forward" />
                  </Button>
                </Mobile>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default ChartSelector;
