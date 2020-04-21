import _ from 'lodash';
import moment from 'moment';

import Bank from '../../bank';
import { amount } from '../../helpers';
import { IAllocationEvolutionChart } from './allocationEvolutionChart';
import { IBreakEvenPointChartData } from './breakEvenPointChart';
import { IIncomeVsSavingsChartData } from './incomeVsSavingsChart';
import { IChartAllocationData, ISavingsBreakdownChartData } from './interfaces';
import { INetWorthVsSavingsChartData } from './netWorthVsSavingsChart';
import { IYearlyGoalBurnUpChartData } from './yearlyGoalBurnUp';

class Helpers {
  static readonly colors = [
    '#83c3f7',
    '#4791db',
    '#f28933',
    '#ffdd72',
    '#6a7b83',
  ];
  static readonly landscapeSize = {
    width: 650,
    height: 300,
  };
  static readonly squareSize = {
    width: 400,
    height: 400,
  };

  static toTitleCase(str: string): string {
    return str.replace(
      /\w*/g,
      (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  static formatDateAxis(d: Date): string {
    return moment(d).format('MMM Do YY');
  }

  static formatAmountAxis(v: number) {
    if (v > 1000000) {
      return `${v / 1000000.0}m`;
    }
    return `${v / 1000}k`;
  }

  static formatLegend(value: string | number | React.ReactText[]) {
    return Helpers.toTitleCase(value as string);
  }

  static reactTextToDateString(d: React.ReactText) {
    return Helpers.formatDateAxis(new Date(parseInt(d as string)));
  }

  static formatterTooltip(v: string | number | React.ReactText[]) {
    return amount(v as number, true, true);
  }

  static mapBankToRecap(bank: Bank.IBank) {
    const svsi: IIncomeVsSavingsChartData[] = [];
    const nws: INetWorthVsSavingsChartData[] = [];
    const sb: ISavingsBreakdownChartData[] = [];
    const sae: IAllocationEvolutionChart[] = [];
    const bep: IBreakEvenPointChartData[] = [];
    const ybu: IYearlyGoalBurnUpChartData[] = [];

    _.each(
      _.range(bank.headers.firstYear, new Date().getFullYear() + 1),
      (y: number) => {
        const m1 = y === bank.headers.firstYear ? bank.headers.firstMonth : 1;
        const m2 =
          y === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;

        _.each(_.range(m1, m2 + 1), (m) => {
          svsi.push({
            date: new Date(y, m, 0).getTime(), // last day of m-1
            savings: _.get(bank.totalMonthSavings, [y, m], 0),
            income: _.get(bank.totalMonthIncome, [y, m], 0),
          });

          nws.push({
            date: new Date(y, m, 0).getTime(),
            netWorth: _.get(bank.networth, [y, m], null) as number | null,
            savings: _.get(bank.totalHolding, [y, m], 0),
          });

          sae.push({
            date: new Date(y, m, 0).getTime(),
            allocation: _(bank.savingsInputs)
              .filter(
                (header) =>
                  header.types.indexOf('T') === -1 || header.type === 'T'
              )
              .reduce((acc, header) => {
                const key = _(bank.savingsHeaders).keyBy('id').get([header.id])
                  .label;
                const value =
                  (acc[key] || 0) +
                  _.get(bank.grandTotalMonthInstitution, [y, m, header.id]);
                return { ...acc, [key]: value };
              }, {} as IChartAllocationData),
          });

          if (_.get(bank.networth, [y, m])) {
            const automatic_expenses =
              _.get(bank.totalMonthIncome, [y, m], 0) -
              _.get(bank.totalMonthSavings, [y, m], 0);

            bep.push({
              date: new Date(y, m, 0).getTime(),
              income: Math.round(
                parseFloat(_.get(bank.networth, [y, m], '0')) / 300
              ),
              expenses: Math.max(0, automatic_expenses),
            });
          }
        });

        _.each(_.range(m1, 13), (m) => {
          ybu.push({
            date: new Date(y, m, 0).getTime(),
            goal: m * _.get(bank.monthlyGoal, y, 0),
            done:
              m <= m2
                ? m * _.get(bank.monthlyGoal, y, 0) +
                  _.get(bank.goalYearToDate, [y, m], 0)
                : null,
          });
        });
      }
    );

    _(bank.savingsInputs)
      .filter((header) => {
        return header.types.indexOf('T') === -1 || header.type === 'T';
      })
      .each((header) => {
        const h = _(bank.savingsHeaders).keyBy('id').get([header.id]);
        if (!h) return;

        let header_label = h.label || 'N/A';
        if (h.sublabel) header_label += ' > ' + h.sublabel;

        sb.push({
          name: header_label,
          value: bank.grandTotalInstitution[header.id][header.type],
        });
      });

    return { svsi, nws, sb, sae, bep, ybu };
  }
}

export default Helpers;
