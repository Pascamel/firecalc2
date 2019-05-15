import React from 'react';
import { Col, Container, Row } from 'reactstrap';

interface IProps {
  title: string;
}

export default class HeaderPanel extends React.Component<IProps, {}> {
  render() {
    return (
      <Container fluid className="alert alert-save alert-header">
        <Row>
          <Col>
            <span className="title">{this.props.title}</span>
          </Col>
        </Row>
      </Container>
    );
  }
}
