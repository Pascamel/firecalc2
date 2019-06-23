import React from 'react';
import { Col, Container, Row } from 'reactstrap';

interface IProps {
  title: string;
}

const HeaderPanel = (props: IProps) => {
  const { title } = props;
  
  return (
    <Container fluid className="alert alert-save alert-header">
      <Row>
        <Col>
          <span className="title">{title}</span>
        </Col>
      </Row>
    </Container>
  );
}

export default HeaderPanel;
