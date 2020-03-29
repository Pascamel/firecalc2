import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Col, Container, Row } from 'reactstrap';

interface IProps {
  color?: string;
}

const LoadingPanel = (props: IProps) => {
  const color = props.color || 'header';

  return (
    <Container fluid className={`alert-${color}`}>
      <Row>
        <Col>
          <div className="loading-spinner">
            <FontAwesomeIcon icon="spinner" spin />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoadingPanel;
