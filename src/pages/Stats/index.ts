import { withAuthorization } from '../../firebase/withAuthorization';
import StatsPageBase from './statsPage'; 


const authCondition = (authUser: firebase.User) => !!authUser;

export const StatsPage = withAuthorization(authCondition)(StatsPageBase);
