import React from 'react';
import { Alert, Col, Container, Row } from 'reactstrap';

import { HeaderPanel, LoadingPanel } from '../../components';
import { firestore } from '../../firebase';
import ListUsers from './listUsers';

interface IState {
  loading: boolean,
  users: any
}
export default class AdminPageBase extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loading: true,
      users: []
    }
  }

  async componentDidMount() {
    const users = await firestore.getUsers();
    const list: any = [];
    
    users.docs.forEach(doc => list.push({id: doc.id, ...doc.data()}));

    this.setState({users: list, loading: false});
  }

  render() {
    const { users, loading } = this.state;
    return (
      <React.Fragment>
        {loading && <LoadingPanel />}
        {!loading && <HeaderPanel title="Admin" />}
        {!loading && <Container fluid className="top-shadow">
          <Row>
            <Col className="pl-0 pr-0">
              <Container>
                <Row>
                  <Col>
                    <Alert color="background">
                      <ListUsers users={users} />
                    </Alert>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>}
      </React.Fragment>
    );
  }
}
