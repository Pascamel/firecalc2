import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';

import Bank from '../../bank';
import { cleanPercentage } from '../../helpers';
import { AppState } from '../../store';
import Progress from './progress';

interface IProps {
  month: string;
  year: string;
  bank: Bank.IBank;
}

const HeaderProgress = ({ month, year, bank }: IProps) => {
  return (
    <Alert color="background">
      <Progress
        label="Month"
        result={bank.goalMonth[year][month]}
        goal={bank.monthlyGoal[year]}
        percentage={cleanPercentage(
          bank.goalMonth[year][month] / bank.monthlyGoal[year]
        )}
      />
      <Progress
        className="mt-2"
        label="Year"
        result={bank.goalYearToDate[year][month]}
        goal={parseInt(month) * bank.monthlyGoal[year]}
        percentage={cleanPercentage(
          bank.goalYearToDate[year][month] /
            bank.monthlyGoal[year] /
            parseInt(month)
        )}
      />
    </Alert>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    bank: state.bankState.bank,
  };
};

export default connect(mapStateToProps)(HeaderProgress);
