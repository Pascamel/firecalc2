import React, { useEffect, useState } from 'react';
import { Alert, Col, Container, Row } from 'reactstrap';

import { HeaderPanel, LoadingPanel } from '../../components';
import { firestore } from '../../firebase';
import ListUsers from './listUsers';

type UserType = {
  id: string;
  email?: string;
  type?: number;
};

const AdminPageBase = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Array<UserType>>([]);

  useEffect(() => {
    let isSubscribed = true;

    firestore.getUsers().then((res) => {
      const list: Array<UserType> = [];

      res.docs.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));

      if (isSubscribed) {
        setLoading(false);
        setUsers(list);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, []);

  if (loading) {
    return <LoadingPanel />;
  }

  return (
    <>
      <HeaderPanel title="Admin" />
      <Container fluid className="top-shadow">
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
      </Container>
    </>
  );
};

export default AdminPageBase;
