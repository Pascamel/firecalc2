import { withAuthorization } from '../../firebase/withAuthorization';
import RevenuesPageBase from './revenuesPage'; 


const authCondition = (authUser: firebase.User) => !!authUser;

export const RevenuesPage = withAuthorization(authCondition)(RevenuesPageBase);
