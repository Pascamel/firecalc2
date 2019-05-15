import React from 'react';
import { Col, Container, Row } from 'reactstrap';

export default class HeaderPanel extends React.Component<{}, {}> {
  render () {
    return (
      <Container fluid className="alert alert-save alert-header">
        <Row>
          <Col>
            <span className="title">Last update</span>
          </Col>
        </Row>
      </Container>
    );
  }
}
