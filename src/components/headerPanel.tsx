import React from 'react';
import { Col, Container, Row } from 'reactstrap';

import { Text } from '../components';

interface IProps {
  title: string;
}

const HeaderPanel = ({ title }: IProps) => {
  return (
    <Container fluid className="alert alert-save alert-header">
      <Row>
        <Col>
          <Text className="title">{title}</Text>
        </Col>
      </Row>
    </Container>
  );
};

export default HeaderPanel;
