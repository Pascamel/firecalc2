import React from 'react';
import { Alert, Col, Row } from 'reactstrap';

import HeaderCharts from './headerCharts';
import HeaderNotes from './headerNotes';
import HeaderProgress from './headerProgress';

interface IProps {
  month: string;
  year: string;
}

const Header = ({ year, month }: IProps) => {
  return (
    <Alert color="background" className="transparent">
      <Row>
        <Col md={4} sm={12} className="alert-background-separator">
          <HeaderProgress month={month} year={year} />
        </Col>
        <Col md={4} sm={12} className="alert-background-separator">
          <HeaderCharts month={month} year={year} />
        </Col>
        <Col md={4} sm={12}>
          <HeaderNotes month={month} year={year} />
        </Col>
      </Row>
    </Alert>
  );
};

export default Header;
