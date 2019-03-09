import { withAuthorization } from '../../firebase/withAuthorization';
import MonthPageBase from './page'; 


const authCondition = (authUser: firebase.User) => !!authUser;

export const MonthPage = withAuthorization(authCondition)(MonthPageBase);
