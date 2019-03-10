import React from 'react';
import { Container, Row, Col } from 'reactstrap';

export default class LoadingPanel extends React.Component<{}, {}> {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col>
            <div className="loading-spinner">
              <div className="fa fa-spinner fa-spin"></div>
            </div>
          </Col>
        </Row>
      </Container>
    )
  };
}
