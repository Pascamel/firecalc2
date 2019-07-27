import React from 'react';
import { Col, Container, Row } from 'reactstrap';

export const NotAuthorizedPage = () => {
  return (
    <Container fluid className="top-shadow">
      <Row>
        <Col className="pr-0 pl-0">
          <Container>
            <Row >
              <Col className="pt-5 pm-5">
                <div className="background-wrapper">
                  <div className="background error-403" />
                </div>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
