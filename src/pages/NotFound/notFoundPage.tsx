import * as React from 'react';
import { Container, Row, Col } from 'reactstrap';
export const NotFoundPage = () => {
  return (
    <section className="section-404">
      <Container>
        <Row>
          <Col sm={{size: 10, offset: 1}} className="text-center">
            <div className="background-404">
              <h1 className="text-center">404</h1>
            </div>
            <div className="content-box-404">
              <h3 className="h2">Look like you're lost</h3>
              <p>the page you are looking for is not available!</p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};