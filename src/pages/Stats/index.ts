import { withAuthorization } from '../../firebase/withAuthorization';
import StatsBase from './page'; 


const authCondition = (authUser: firebase.User) => !!authUser;

export const StatsPage = withAuthorization(authCondition)(StatsBase);
