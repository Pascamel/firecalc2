import { withAuthorization } from '../../firebase/withAuthorization';
import HomePageBase from './homePage'; 


const authCondition = (authUser: firebase.User) => !!authUser;

export const HomePage = withAuthorization(authCondition)(HomePageBase);