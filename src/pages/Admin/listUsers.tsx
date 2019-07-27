import React from 'react';

import { IUser } from './interfaces';
import User from './user';

interface IProps {
  users: Array<IUser>;
}

const ListUsers = (props: IProps) => {
  const { users } = props;
  
  return (
    <>
      <b>{users.length}</b> users
      <table className="table mt-3">
        <thead>
          <tr>
            <th style={{width: '2%'}}></th>
            <th style={{width: '30%'}}>ID</th>
            <th style={{width: '58%'}}>Email</th>
            <th style={{width: '10%'}}>Type</th>
          </tr>
        </thead>
        {users.map(user => <User key={user.id} user={user} />)}
      </table>
    </>      
  );
}


export default ListUsers;
