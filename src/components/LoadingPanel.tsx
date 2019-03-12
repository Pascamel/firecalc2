import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class LoadingPanel extends React.Component<{}, {}> {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col>
            <div className="loading-spinner">
              <FontAwesomeIcon icon="spinner" spin />
            </div>
          </Col>
        </Row>
      </Container>
    )
  };
}
