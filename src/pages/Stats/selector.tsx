import React from 'react';
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, NavItem } from 'reactstrap';
import { Link, NavLink } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as CHARTS from '../../constants/charts';
import _ from 'lodash';


interface IProps {
  type: string
}

export default class Selector extends React.Component<IProps, {}> {
  render () {
    const { type } = this.props;
    
    return (
      <Container fluid className="alert alert-save alert-light">
        <Row>
          <Col>
            <Container>
              <Row>
                <Col>
                  <Breadcrumb>
                    {Object.entries(CHARTS.URL).map((t, key: number) => ( 
                      <BreadcrumbItem key={key}>
                      {type === t[1] && _.get(CHARTS.LABELS, t[0])}
                      {type !== t[1] && <NavLink to={ROUTES.STATS.replace(':type', _.get(CHARTS.URL, t[0]))}>
                        {_.get(CHARTS.LABELS, t[0])}
                      </NavLink>}
                    </BreadcrumbItem>
                    ))}
                  </Breadcrumb>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}