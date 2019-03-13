import React from 'react';
import { Container, Row, Col } from 'reactstrap';


interface IProps {
  users: any
}

export default class ListUsers extends React.Component<IProps, {}> {
  render () {
    const { users} = this.props;
    console.log('users', this.props.users);

    return (
      <Container>
        <Row>
          <Col>
            <b>{users.length}</b> users
          </Col>
        </Row>

        {users.map((user: any) => (
          <Row key={user.id}>
            <Col>
              {user.email} - {user.type} - {user.id}
            </Col>
          </Row>
        ))}
      </Container>
      
    );
  }
}
