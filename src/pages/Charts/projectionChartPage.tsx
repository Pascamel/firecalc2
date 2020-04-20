import _ from 'lodash';
import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Badge, Col, ListGroup, ListGroupItem, Row, Tooltip as TooltipStrap } from 'reactstrap';

import { loadBank } from '../../actions';
import Bank from '../../bank';
import { Icon, LoadingPanel, NavButtonGroup, StaticAmount } from '../../components';
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
  onLoadBank: (uid: string) => void;
  darkMode: boolean;
}

const ProjectionChartPage = (props: IProps & RouteComponentProps) => {
  const DEFAULT_AMOUNTS = [80, 90, 100, 110, 120, 130, 150].map(
    (v) => v * 1000
  );
  const DEFAULT_AMOUNT = 80000;
  const DEFAULT_YEARS = [10, 15, 20, 25, 30];
  const DEFAULT_YEAR = 10;

  const {
    authUser,
    bank,
    mobile,
    chart,
    onLoadBank,
    bankLoaded,
    darkMode,
  } = props;
  const [amount, setAmount] = useState(
    parseInt(_.get(props, 'match.params.amount')) || DEFAULT_AMOUNT
  );
  const [years, setYears] = useState(
    parseInt(_.get(props, 'match.params.years')) || DEFAULT_YEAR
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

  const [tooltipValue, setTooltipValue] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = (v: number) => {
    setTooltipValue(v);
    setTooltipOpen(!tooltipOpen);
  };

  useEffect(() => {
    if (!authUser || bankLoaded) return;

    onLoadBank(authUser.uid);
  }, [authUser, bankLoaded, onLoadBank]);

  const setRouteAmount = (s: number) => {
    const route = ROUTES.CHARTS_YEARS_AMOUNT.replace(':type', chart)
      .replace(':years', years.toString())
      .replace(':amount', s.toString());

    props.history.push(route);
    setAmount(s);
  };

  const setRouteYears = (y: number) => {
    const route = ROUTES.CHARTS_YEARS_AMOUNT.replace(':type', chart)
      .replace(':years', y.toString())
      .replace(':amount', amount.toString());

    props.history.push(route);
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

  if (!bankLoaded) return <LoadingPanel />;

  return (
    <Row>
      <Col md={2} sm={12}>
        {!mobile && (
          <ListGroup>
            {DEFAULT_AMOUNTS.map((v) => (
              <ListGroupItem
                key={v}
                className="text-left cursor"
                color={amount === v ? 'primary' : 'darker'}
                onClick={() => setRouteAmount(v)}
              >
                $
                <StaticAmount display-zero hide-decimals>
                  {v}
                </StaticAmount>
                <Badge id={`tooltipIcon${v}`} pill className="pull-right mt-1">
                  <Icon icon="info" size="sm" />
                  <TooltipStrap
                    placement="top"
                    isOpen={tooltipOpen && tooltipValue === v}
                    autohide={false}
                    target={`tooltipIcon${v}`}
                    toggle={() => toggleTooltip(v)}
                  >
                    $
                    <StaticAmount display-zero hide-decimals>
                      {v / 12}
                    </StaticAmount>{' '}
                    / mo
                  </TooltipStrap>
                </Badge>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
        {!mobile && (
          <ListGroup className="mt-3">
            {DEFAULT_YEARS.map((v) => (
              <ListGroupItem
                key={v}
                className="text-left cursor"
                color={years === v ? 'primary' : 'darker'}
                onClick={() => setRouteYears(v)}
              >
                {v} years
              </ListGroupItem>
            ))}
          </ListGroup>
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
      <Col md={10} sm={12} className="chart-container">
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

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onLoadBank: (uid: string) => dispatch(loadBank(uid)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectionChartPage);
