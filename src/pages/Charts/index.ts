import { withAuthorization } from '../../firebase/withAuthorization';
import ChartsPageBase from './chartsPage'; 


const authCondition = (authUser: firebase.User) => !!authUser;

export const ChartsPage = withAuthorization(authCondition)(ChartsPageBase);
