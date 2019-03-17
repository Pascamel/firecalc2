import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface IProps {
  color?: string;
}

export default class LoadingPanel extends React.Component<IProps, {}> {
  render() {
    const color = this.props.color || 'header';

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
    )
  };
}
