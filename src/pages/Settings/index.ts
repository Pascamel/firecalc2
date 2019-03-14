import { withAuthorization } from '../../firebase/withAuthorization';
import SettingsPageBase from './settingsPage'; 


const authCondition = (authUser: firebase.User) => !!authUser;

export const SettingsPage = withAuthorization(authCondition)(SettingsPageBase);
