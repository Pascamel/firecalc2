import React from 'react';
import Income from './income';
import helpers from '../../helpers';
import { Bank } from '../../bank';


interface IProps {
  bank: Bank,
  addHeaderCallback: (type: string) => void;

  editHeaderCallback: (type: string, header: any) => void;
  confirmEditHeaderCallback: (type: string, header: any) => void;
  cancelEditHeaderCallback: (type: string, header: any) => void;
  deleteHeaderCallback: (type: string, header: any) => void;
  moveUpHeaderCallback: (type: string, index: number) => void;
  moveDownHeaderCallback: (type: string, index: number) => void;
}

export default class Incomes extends React.Component<IProps, {}> {
  newHeader = () => {
    this.props.addHeaderCallback('incomes');
  }

  render() {
    const { bank } = this.props;

    return (
      <React.Fragment>
        <div className="row">
          <div className="col mt-4">
            <h3>Income</h3>
          </div>
        </div>

        <div className={`row ${helpers.showIf(!bank.headers.incomes.length)}`}>
          <div className="col">
            No headers
          </div>
        </div>

        {bank.headers.incomes.map((header: any, key: number) => (
          <Income key={key} header={header} index={key} {...this.props} />
        ))}

        <div className="row">
          <div className="col">
            <button type="button" className="btn btn-light btn-block" onClick={this.newHeader}>
              Add new
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
