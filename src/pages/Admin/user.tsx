import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';

import * as ROLES from '../../constants/roles';
import { firestore } from '../../firebase';
import { IUser, IUserData } from './interfaces';

interface IUserProps {
  user: IUser;
}

const User = ({ user }: IUserProps) => {
  const [collapsed, setCollapsed] = useState(true);
  const [userData, setUserData] = useState<IUserData>({});
  const [userDataLoaded, setUserDataLoaded] = useState(false);

  const loadUserData = async (uid: string) => {
    const result: IUserData = {};

    const snapshotHeaders = await firestore.getHeaders(uid);
    const snapshotSavings = await firestore.getSavings(uid);
    const snapshotRevenues = await firestore.getRevenues(uid);
    const snapshotOthers = await firestore.getOthers(uid);

    const headers = snapshotHeaders.data();
    const savings = snapshotSavings.data();
    const income = snapshotRevenues.data();
    const others = snapshotOthers.data();

    if (headers) result.headers = moment(headers.last_update).fromNow();
    if (savings) result.savings = moment(savings.last_update).fromNow();
    if (income) result.income = moment(income.last_update).fromNow();
    if (others) result.others = moment(others.last_update).fromNow();

    return result;
  };

  const toggleCollapsed = () => {
    if (collapsed && !userDataLoaded) {
      loadUserData(user.id).then(data => {
        setUserData(data);
        setUserDataLoaded(true);
      });
    }
    setCollapsed(!collapsed);
  };

  const labelType = (type: number) => {
    return _(ROLES)
      .invert()
      .get(type, 'none');
  };

  return (
    <tbody>
      <tr>
        <td onClick={toggleCollapsed}>
          <FontAwesomeIcon
            icon={collapsed ? 'chevron-right' : 'chevron-down'}
          />
        </td>
        <td>{user.id}</td>
        <td>{user.email}</td>
        <td>{user.type ? labelType(user.type) : 'N/A'}</td>
      </tr>
      {!collapsed && (
        <tr>
          <td></td>
          <td colSpan={2}>
            {!userDataLoaded && <FontAwesomeIcon icon="spinner" spin />}
            {userDataLoaded && <UserData userData={userData} />}
          </td>
        </tr>
      )}
    </tbody>
  );
};

const UserData = ({ userData }: { userData: IUserData }) => (
  <table className="table table-borderless table-sm">
    <tbody>
      <tr>
        <td>headers</td>
        <td>Savings</td>
        <td>Income</td>
        <td>Others</td>
      </tr>
      <tr>
        <td>{userData.headers}</td>
        <td>{userData.savings}</td>
        <td>{userData.income}</td>
        <td>{userData.others}</td>
      </tr>
    </tbody>
  </table>
);

export default User;
