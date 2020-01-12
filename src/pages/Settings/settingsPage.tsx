import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';

import { loadBank } from '../../actions';
import { LoadingPanel, SavePanel } from '../../components';
import { AppState } from '../../store';
import Incomes from './incomes';
import Savings from './savings';
import StartingPoint from './startingPoint';
import YearlyGoals from './yearlyGoals';

interface IProps {
  authUser: firebase.User|null;
  bankLoaded: boolean;
  onLoadBank: (uid: string) => void;
}

type tabsContentType = {
  [key: string]: {
    label: string,
    component: JSX.Element
  }
};

const tabsContent: tabsContentType = {
  'starting-point': {
    label: 'Starting Point',
    component: (<StartingPoint />)
  },
  'savings': {
    label: 'Savings',
    component: (<Savings />)
  },
  'incomes': {
    label: 'Incomes',
    component: (<Incomes />)
  },
  'yearly-goals': {
    label: 'Yearly Goals',
    component: (<YearlyGoals />)
  }
};

const SettingsPageBase = (props: IProps) => {
  const { authUser, bankLoaded, onLoadBank } = props;
  const [activeTab, setActiveTab] = useState('yearly-goals'); //'starting-point');

  const toggle = (tab: string) => {
    if(activeTab !== tab) setActiveTab(tab);
  }
  
  useEffect(() => {
    if (bankLoaded || !authUser ) return;
    
    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, onLoadBank]);
  
  if (!bankLoaded) return <LoadingPanel />;

  return (
    <>
      <SavePanel label="Settings" />
      <Container fluid className="top-shadow">
        <Row>
          <Col className="pl-0 pr-0">
            <Container>
              <Nav tabs className="tab-nav-bar">
                {Object.keys(tabsContent).map(key => (
                  <NavItem key={key}>
                    <NavLink className={activeTab === key ? 'active' : ''} onClick={() => { toggle(key); }}>
                      {tabsContent[key].label}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
              <TabContent activeTab={activeTab}>
                {Object.keys(tabsContent).map(key => (
                  <TabPane tabId={key} key={key}>
                    {tabsContent[key].component}
                  </TabPane>
                ))}
              </TabContent>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
}

const mapStateToProps = (state: AppState) => {
  return ({
    authUser: state.sessionState.authUser,
    bankLoaded: state.bankState.bankLoaded
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onLoadBank: (uid: string) => {
      dispatch(loadBank(uid));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPageBase);
