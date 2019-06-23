import React from 'react';
import { Col, Container, Row } from 'reactstrap';

const HeaderPanel = () => (
  <Container fluid className="alert alert-save alert-header">
    <Row>
      <Col>
        <span className="title">Last update</span>
      </Col>
    </Row>
  </Container>
);

export default HeaderPanel;
