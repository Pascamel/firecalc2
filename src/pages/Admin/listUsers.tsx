import _ from 'lodash';
import React from 'react';

import * as ROLES from '../../constants/roles';

type UserType = {
  id: string,
  email?: string,
  type?: number
}

interface IProps {
  users: Array<UserType>
}

const ListUsers = (props: IProps) => {
  const { users } = props;
  
  const labelType = (type: number) => {
    return _(ROLES).invert().get(type, 'none');
  }

  return (
    <>
      <b>{users.length}</b> users
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th style={{width: '30%'}}>ID</th>
            <th style={{width: '60%'}}>Email</th>
            <th style={{width: '10%'}}>Type</th>
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

export default ListUsers;
