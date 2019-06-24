import { withAuthorization } from '../../firebase/withAuthorization';
import { AccountPageBase } from './accountPage';

const authCondition = (authUser: firebase.User) => !!authUser;

export const AccountPage = withAuthorization(authCondition)(AccountPageBase);
