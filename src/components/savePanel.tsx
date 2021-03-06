import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Col, Container, Row } from 'reactstrap';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { loadBank, saveBank, saveHeaders } from '../actions';
import Bank from '../bank';
import { Icon, Text } from '../components';
import { joinFilter } from '../helpers';
import { AppState } from '../store';
import { DecimalsBtn, FiltersBtn } from './';

interface IProps {
  className?: string;
  authUser: firebase.User;
  label: string;
  bankSavingsUpdated: boolean;
  bankIncomeUpdated: boolean;
  bankExpensesUpdated: boolean;
  bankOthersUpdated: boolean;
  bankHeadersUpdated: boolean;
  saveInProgress: boolean;
  bank: Bank.IBank;
  prevMonth?: () => void;
  nextMonth?: () => void;
  prevMonthDisabled?: boolean;
  nextMonthDisabled?: boolean;
  onLoadBank: (uid: string) => void;
  onSaveBank: (
    uid: string,
    bank: Bank.IBank,
    savings: boolean,
    income: boolean,
    expenses: boolean,
    settings: boolean
  ) => void;
  onSaveHeaders: (uid: string, bank: Bank.IBank) => void;
}

const SavePanel = (props: IProps) => {
  const {
    className,
    authUser,
    label,
    bankSavingsUpdated,
    bankIncomeUpdated,
    bankExpensesUpdated,
    bankOthersUpdated,
    bankHeadersUpdated,
    saveInProgress,
    bank,
    prevMonth,
    nextMonth,
    prevMonthDisabled,
    nextMonthDisabled,
    onLoadBank,
    onSaveBank,
    onSaveHeaders,
  } = props;

  const cancelClick = () => {
    if (!authUser) return;

    onLoadBank(authUser.uid);
  };

  const saveClick = () => {
    if (!authUser) return;

    if (label === 'Settings') {
      onSaveHeaders(authUser.uid, bank);
    }

    if (
      bankSavingsUpdated ||
      bankIncomeUpdated ||
      bankExpensesUpdated ||
      bankOthersUpdated
    ) {
      onSaveBank(
        authUser.uid,
        bank,
        bankSavingsUpdated,
        bankIncomeUpdated,
        bankExpensesUpdated,
        bankOthersUpdated
      );
    }
  };

  const bankUpdated =
    bankSavingsUpdated ||
    bankIncomeUpdated ||
    bankExpensesUpdated ||
    bankOthersUpdated ||
    bankHeadersUpdated;

  return (
    <Container
      fluid
      className={joinFilter(
        ...[
          'alert alert-save alert-header',
          bankUpdated ? 'updated' : null,
          className ?? null,
        ]
      )}
    >
      <Row>
        <Col className="pr-0 pl-0">
          <Container>
            <Row>
              <Col className="text-center">
                {label === 'Savings' && (
                  <ButtonGroup className="pull-left">
                    <FiltersBtn />
                    <DecimalsBtn />
                  </ButtonGroup>
                )}

                {label === 'Revenues' && (
                  <ButtonGroup className="pull-left">
                    <DecimalsBtn />
                  </ButtonGroup>
                )}

                {['Savings', 'Revenues', 'Settings'].indexOf(label) === -1 && (
                  <ButtonGroup className="pull-left">
                    <Button
                      color="outline-light"
                      onClick={prevMonth}
                      disabled={prevMonthDisabled}
                    >
                      <Icon icon="backward" />
                    </Button>
                    <Button
                      color="outline-light"
                      onClick={nextMonth}
                      disabled={nextMonthDisabled}
                    >
                      <Icon icon="forward" />
                    </Button>
                  </ButtonGroup>
                )}

                <Text className="title nowrap-ellipsis">{label}</Text>

                <Button
                  color={bankUpdated ? 'header' : 'outline-light'}
                  className="btn-save"
                  onClick={saveClick}
                >
                  {!saveInProgress && (
                    <Icon icon={['far', 'save']} className="mr-1" />
                  )}
                  {saveInProgress && (
                    <Icon icon="spinner" className="mr-1" spin />
                  )}
                  {saveInProgress ? 'Saving' : 'Save'}
                </Button>

                {bankUpdated && !saveInProgress && (
                  <Button
                    color="header"
                    className="btn-cancel"
                    onClick={cancelClick}
                  >
                    <Icon icon="times" /> Cancel
                  </Button>
                )}
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    authUser: state.sessionState.authUser,
    bank: state.bankState.bank,
    bankSavingsUpdated: state.bankState.bankSavingsUpdated,
    bankIncomeUpdated: state.bankState.bankIncomeUpdated,
    bankExpensesUpdated: state.bankState.bankExpensesUpdated,
    bankOthersUpdated: state.bankState.bankOthersUpdated,
    bankHeadersUpdated: state.bankState.bankHeadersUpdated,
    saveInProgress: state.bankState.saveInProgress,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, void, AnyAction>
) => {
  return {
    onLoadBank: (uid: string) => dispatch(loadBank(uid)),
    onSaveBank: (
      uid: string,
      bank: Bank.IBank,
      savings: boolean,
      income: boolean,
      expenses: boolean,
      settings: boolean
    ) => dispatch(saveBank(uid, bank, savings, income, expenses, settings)),
    onSaveHeaders: (uid: string, bank: Bank.IBank) =>
      dispatch(saveHeaders(uid, bank)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SavePanel);
