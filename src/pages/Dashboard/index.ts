import { withAuthorization } from '../../firebase/withAuthorization';
import DashboardPageBase from './dashboardPage'; 


const authCondition = (authUser: firebase.User) => !!authUser;

export const DashboardPage = withAuthorization(authCondition)(DashboardPageBase);
