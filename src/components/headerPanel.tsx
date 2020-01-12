import React from 'react';
import { Col, Container, Row } from 'reactstrap';

import { Text } from '../components';

interface IProps {
  title: string;
}

const HeaderPanel = (props: IProps) => {
  const { title } = props;
  
  return (
    <Container fluid className="alert alert-save alert-header">
      <Row>
        <Col>
          <Text className="title" content={title} />
        </Col>
      </Row>
    </Container>
  );
}

export default HeaderPanel;
