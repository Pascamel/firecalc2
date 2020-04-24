import React from 'react';
import { Col, Container, Row } from 'reactstrap';

import { Icon } from '../components';

interface IProps {
  color?: string;
}

const LoadingPanel = ({ color }: IProps) => (
  <Container fluid className={`alert-${color || 'header'}`}>
    <Row>
      <Col>
        <div className="loading-spinner">
          <Icon icon="spinner" spin />
        </div>
      </Col>
    </Row>
  </Container>
);

export default LoadingPanel;
