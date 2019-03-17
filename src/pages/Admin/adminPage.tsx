import React from 'react';
import { Container, Row, Col, Alert } from 'reactstrap';
import HeaderPanel from '../../components/headerPanel';
import LoadingPanel from '../../components/LoadingPanel';
import ListUsers from './listUsers';
import { firestore } from '../../firebase';


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
            <Col>
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
