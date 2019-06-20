import _ from 'lodash';
import React from 'react';
import * as ROLES from '../../constants/roles';

interface IProps {
  users: any
}

export default class ListUsers extends React.Component<IProps, {}> {
  render() {
    const { users } = this.props;
    
    const labelType = (type: number) => {
      return _(ROLES).invert().get(type, 'none');
    }

    return (
      <>
        <b>{users.length}</b> users
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th style={{width: '30%'}}>one</th>
              <th style={{width: '60%'}}>one</th>
              <th style={{width: '10%'}}>one</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{labelType(user.type)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>      
    );
  }
}
