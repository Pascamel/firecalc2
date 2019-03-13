import { withAuthorization } from '../../firebase/withAuthorization';
import SavingsPageBase from './savingsPage'; 


const authCondition = (authUser: firebase.User) => !!authUser;

export const SavingsPage = withAuthorization(authCondition)(SavingsPageBase);
