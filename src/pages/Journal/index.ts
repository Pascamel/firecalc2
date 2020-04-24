import { withAuthorization } from '../../firebase/withAuthorization';
import JournalPageBase from './journalPage';

const authCondition = (authUser: firebase.User) => !!authUser;

export const JournalPage = withAuthorization(authCondition)(JournalPageBase);
