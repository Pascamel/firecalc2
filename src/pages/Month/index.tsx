import React, { Component} from 'react';
import { Bank } from '../../bank';
import { AuthUserContext } from '../../firebase/AuthUserContext';
import { withAuthorization } from '../../firebase/withAuthorization';

interface IProps {
  
}
interface IState {
  loading: boolean,
  bank: Bank|null
}

export class MonthPageBase extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      loading: true,
      bank: null
    }
  }

  componentDidMount () {
    let bank = new Bank();  //this.props.firebase);
    bank.load().then(() => {
      this.setState({bank: bank, loading: false});
      console.log(bank);
      console.log('income')
      console.log(bank.income);
      console.log('savings')
      console.log(bank.savings);
    }).catch(function(error) {});
  }

  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <span>Month</span>
        )}
      </AuthUserContext.Consumer>
    )
  }
}

const authCondition = (authUser: firebase.User) => !!authUser;

export const MonthPage = withAuthorization(authCondition)(MonthPageBase);
