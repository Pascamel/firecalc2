import React from 'react';
import { Container, Row, Col, ButtonGroup, Button } from 'reactstrap';
import _ from 'lodash';
import * as ROUTES from '../../constants/routes';
import * as CHARTS from '../../constants/charts';


interface IProps {
  history: any;
  type: string
}

export default class Selector extends React.Component<IProps, {}> {

  goTo = (type: string): void => {
    const route = ROUTES.CHARTS.replace(':type', _.get(CHARTS.URL, type));
    this.props.history.push(route);
  }

  render () {
    const { type } = this.props;
    
    return (
      <Container fluid className="alert alert-save alert-header">
        <Row>
          <Col className="pl-0 pr-0">
            <Container>
              <Row>
                <Col>
                  <ButtonGroup>
                    {Object.entries(CHARTS.URL).map((t, key: number) => ( 
                      <Button color="link" key={key} disabled={type===t[1]} onClick={(e: any) => this.goTo(t[0])}>
                        {_.get(CHARTS.LABELS, t[0])}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}
