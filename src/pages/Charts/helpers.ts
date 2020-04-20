import moment from 'moment';

import { amount } from '../../helpers';

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

  static formatdateToString(d: Date): string {
    return moment(d).format('MMM Do YY');
  }

  static formatLegend(value: string | number | React.ReactText[]) {
    return Helpers.toTitleCase(value as string);
  }

  static reactTextToDateString(d: React.ReactText) {
    return Helpers.formatdateToString(new Date(parseInt(d as string)));
  }

  static formatterTooltip(v: string | number | React.ReactText[]) {
    return amount(v as number, true, true);
  }
}

export default Helpers;
