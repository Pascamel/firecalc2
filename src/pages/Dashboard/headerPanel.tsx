import React from 'react';
import { Container, Row, Col } from 'reactstrap';


export default class HeaderPanel extends React.Component<{}, {}> {
  render () {
    return (
      <Container fluid className="alert alert-save alert-light">
        <Row>
          <Col>
            <span className="title">Last update</span>
          </Col>
        </Row>
      </Container>
    );
  }
}
