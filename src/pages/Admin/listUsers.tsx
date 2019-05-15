import React from 'react';

interface IProps {
  users: any
}

export default class ListUsers extends React.Component<IProps, {}> {
  render () {
    const { users } = this.props;

    return (
      <React.Fragment>
        <b>{users.length}</b> users
        <ul className="list-unstyled">
          {users.map((user: any) => (
            <li key={user.id}>
              {user.email} - {user.type} - {user.id}
            </li>
          ))}
        </ul>
      </React.Fragment>      
    );
  }
}
