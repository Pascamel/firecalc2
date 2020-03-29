import * as ROLES from '../../constants/roles';
import { firestore } from '../../firebase';
import { withAuthorization } from '../../firebase/withAuthorization';
import AdminPageBase from './adminPage';

const authCondition = async (authUser: firebase.User) => {
  if (!authUser) return false;

  const uid = firestore.getCurrentUserUID();
  if (!uid) return;

  const user = await firestore.getUser(uid);
  const data = user.data();
  if (!data) return false;

  if (data.type !== ROLES.ADMIN) return false;

  return true;
};

export const AdminPage = withAuthorization(authCondition)(AdminPageBase);
