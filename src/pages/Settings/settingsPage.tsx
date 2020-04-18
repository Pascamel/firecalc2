import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Container, ListGroup, ListGroupItem, Row } from 'reactstrap';

import { loadBank } from '../../actions';
import { LoadingPanel, Mobile, NavButtonGroup, NotMobile, SavePanel } from '../../components';
import { AppState } from '../../store';
import Incomes from './incomes';
import Savings from './savings';
import StartingPoint from './startingPoint';
import YearlyGoals from './yearlyGoals';

interface IProps {
  authUser: firebase.User | null;
  bankLoaded: boolean;
  onLoadBank: (uid: string) => void;
}

type tabsContentType = {
  [key: string]: {
    label: string;
    component: JSX.Element;
  };
};

const tabsContent: tabsContentType = {
  'starting-point': {
    label: 'Starting Point',
    component: <StartingPoint />
  },
  savings: {
    label: 'Savings',
    component: <Savings />
  },
  incomes: {
    label: 'Incomes',
    component: <Incomes />
  },
  'yearly-goals': {
    label: 'Yearly Goals',
    component: <YearlyGoals />
  }
};

const tabsKeys = Object.keys(tabsContent);

const SettingsPageBase = (props: IProps) => {
  const { authUser, bankLoaded, onLoadBank } = props;
  const [activeTab, setActiveTab] = useState('starting-point');

  useEffect(() => {
    if (bankLoaded || !authUser) return;

    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, onLoadBank]);

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const prevSetting = () => {
    const newIndex =
      (tabsKeys.indexOf(activeTab) + tabsKeys.length - 1) % tabsKeys.length;

    setActiveTab(tabsKeys[newIndex]);
  };

  const nextSetting = () => {
    const newIndex =
      (tabsKeys.indexOf(activeTab) + tabsKeys.length + 1) % tabsKeys.length;

    setActiveTab(tabsKeys[newIndex]);
  };

  if (!bankLoaded) return <LoadingPanel />;

  return (
    <>
      <SavePanel label="Settings" />
      <Container fluid className="top-shadow">
        <Row>
          <Col className="pl-0 pr-0">
            <Container>
              <Row>
                <Col md={2} sm={12}>
                  <NotMobile>
                    <ListGroup>
                      {Object.keys(tabsContent).map(key => (
                        <ListGroupItem
                          key={key}
                          className="text-left cursor"
                          color={activeTab === key ? 'primary' : 'darker'}
                          onClick={() => toggle(key)}
                        >
                          {tabsContent[key].label}
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </NotMobile>
                  <Mobile>
                    <NavButtonGroup
                      color="light"
                      button-color="outline-secondary"
                      on-click={[prevSetting, nextSetting]}
                      label={tabsContent[activeTab].label}
                    />
                  </Mobile>
                </Col>
                <Col md={10} sm={12}>
                  {tabsContent[activeTab].component}
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    authUser: state.sessionState.authUser,
    bankLoaded: state.bankState.bankLoaded
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onLoadBank: (uid: string) => {
      dispatch(loadBank(uid));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPageBase);
