import React from 'react';

import { IUser } from './interfaces';
import User from './user';

interface IProps {
  users: Array<IUser>;
}

const ListUsers = ({ users }: IProps) => (
  <>
    <b>{users.length}</b> users
    <table className="table table-users mt-3">
      <thead>
        <tr>
          <th></th>
          <th>ID</th>
          <th>Email</th>
          <th>Type</th>
        </tr>
      </thead>
      {users.map((user) => (
        <User key={user.id} user={user} />
      ))}
    </table>
  </>
);

export default ListUsers;
