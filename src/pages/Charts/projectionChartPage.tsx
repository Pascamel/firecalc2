import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Col, CustomInput, Row } from 'reactstrap';

import Bank from '../../bank';
import { LoadingPanel, NavButtonGroup } from '../../components';
import ROUTES from '../../constants/routes';
import { amount as amount_, roundFloat } from '../../helpers';
import { AppState } from '../../store';
import { IProjectionChartData } from './interfaces';
import ProjectionChart from './projectionChart';

interface IProps {
  authUser: firebase.User | null;
  bank: Bank.IBank;
  bankLoaded: boolean;
  mobile: boolean;
  chart: string;
  darkMode: boolean;
}

const ProjectionChartPage = ({
  bank,
  mobile,
  chart,
  bankLoaded,
  darkMode,
  match,
  history,
}: IProps & RouteComponentProps) => {
  const DEFAULT_AMOUNTS = [80, 90, 100, 110, 120, 130, 150].map(
    (v) => v * 1000
  );
  const DEFAULT_AMOUNT = 80000;
  const DEFAULT_YEARS = [10, 15, 20, 25, 30];
  const DEFAULT_YEAR = 10;

  const [amount, setAmount] = useState(
    parseInt(_.get(match, 'params.amount')) || DEFAULT_AMOUNT
  );
  const [years, setYears] = useState(
    parseInt(_.get(match, 'params.years')) || DEFAULT_YEAR
  );

  const networthActualValues = Object.keys(bank.networth)
    .filter((k) => _.keys(bank.networth[k]).length > 0)
    .reduce((object, k) => {
      object[k] = bank.networth[k];
      return object;
    }, {} as { [year: string]: any });

  const last_year = _(networthActualValues).values().last();
  const year = parseInt(_(networthActualValues).keys().last() || '0');
  const month = parseInt(_(last_year).keys().last() || '0');
  const savings = parseFloat(_(last_year).values().last() || '0');

  const setRouteAmount = (s: number) => {
    const route = ROUTES.CHARTS_YEARS_AMOUNT.replace(':type', chart)
      .replace(':years', years.toString())
      .replace(':amount', s.toString());

    history.push(route);
    setAmount(s);
  };

  const setRouteYears = (y: number) => {
    const route = ROUTES.CHARTS_YEARS_AMOUNT.replace(':type', chart)
      .replace(':years', y.toString())
      .replace(':amount', amount.toString());

    history.push(route);
    setYears(y);
  };

  const prevAmount = () => {
    const index = DEFAULT_AMOUNTS.indexOf(amount);
    if (index <= 0) return;

    setRouteAmount(DEFAULT_AMOUNTS[index - 1]);
  };

  const nextAmount = () => {
    const index = DEFAULT_AMOUNTS.indexOf(amount);
    if (index >= DEFAULT_AMOUNTS.length - 1) return;

    setRouteAmount(DEFAULT_AMOUNTS[index + 1]);
  };

  const prevYear = () => {
    const index = DEFAULT_YEARS.indexOf(years);
    if (index <= 0) return;

    setRouteYears(DEFAULT_YEARS[index - 1]);
  };

  const nextYear = () => {
    const index = DEFAULT_YEARS.indexOf(years);
    if (index >= DEFAULT_YEARS.length - 1) return;

    setRouteYears(DEFAULT_YEARS[index + 1]);
  };

  let projection5 = savings;
  let projection7 = savings;
  let date = new Date(year, month, 1).getTime();

  const data: IProjectionChartData[] = [{ date, projection5, projection7 }];

  for (let i = 1; i <= years; i++) {
    projection5 = roundFloat(projection5 * 1.05 + amount);
    projection7 = roundFloat(projection7 * 1.07 + amount);
    date = new Date(year + i, month, 1).getTime();

    data.push({ date, projection5, projection7 });
  }

  if (!bankLoaded) {
    return <LoadingPanel />;
  }

  return (
    <Row>
      <Col xs={6} sm={{ size: 2, offset: 8 }}>
        {!mobile && (
          <CustomInput
            id="amount-custom-input"
            type="select"
            className="mb-3"
            value={amount}
            onChange={(e) => setRouteAmount(parseInt(e.target.value))}
          >
            {DEFAULT_AMOUNTS.map((value) => (
              <option value={value} key={value}>
                {amount_(value, true, false)}
              </option>
            ))}
          </CustomInput>
        )}
        {mobile && (
          <NavButtonGroup
            color="light"
            button-color="outline-secondary"
            on-click={[prevAmount, nextAmount]}
            disabled={[
              amount === DEFAULT_AMOUNTS[0],
              amount === DEFAULT_AMOUNTS.slice(-1)[0],
            ]}
            label={`$${amount_(amount, true, false)}`}
          />
        )}
      </Col>
      <Col xs={6} sm={2}>
        {!mobile && (
          <CustomInput
            id="years-custom-input"
            type="select"
            value={years}
            onChange={(e) => setRouteYears(parseInt(e.target.value))}
          >
            {DEFAULT_YEARS.map((value) => (
              <option key={value} value={value}>
                {value} years
              </option>
            ))}
          </CustomInput>
        )}
        {mobile && (
          <NavButtonGroup
            color="light"
            button-color="outline-secondary"
            on-click={[prevYear, nextYear]}
            disabled={[
              years === DEFAULT_YEARS[0],
              years === DEFAULT_YEARS.slice(-1)[0],
            ]}
            label={`${years} years`}
          />
        )}
      </Col>

      <Col xs={12}>
        <ProjectionChart data={data} mobile={mobile} darkMode={darkMode} />
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    authUser: state.sessionState.authUser,
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded,
    darkMode: state.sessionState.darkMode,
  };
};

export default connect(mapStateToProps)(ProjectionChartPage);
