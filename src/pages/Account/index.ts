import { withAuthorization } from '../../firebase/withAuthorization';
import AccountPageBase from './accountPage';


const authCondition = (authUser: any) => !!authUser;

export const Account = withAuthorization(authCondition)(AccountPageBase);
