import React from 'react';
import helpers from '../../helpers';
import { Bank } from '../../bank';


interface IProps {
  index: number,
  header: any,
  bank: Bank,

  editHeaderCallback: (type: string, header: any) => void;
  confirmEditHeaderCallback: (type: string, header: any) => void;
  cancelEditHeaderCallback: (type: string, header: any) => void;
  deleteHeaderCallback: (type: string, header: any) => void;
  moveUpHeaderCallback: (type: string, index: number) => void;
  moveDownHeaderCallback: (type: string, index: number) => void;
}

interface IState {
  editLabel: string,
  editPretax: boolean,
  editCount: number
}

export default class Income extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      editLabel: this.props.header.label,
      editPretax: this.props.header.pretax,
      editCount: this.props.header.count
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange = (event: any) => {
    const s: any = {};
    s[event.target.name] = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    this.setState(s);
  }

  editHeaderConfirm = (header: any) => {
    header.label = this.state.editLabel;
    header.pretax = this.state.editPretax;
    header.count = this.state.editCount;
    this.props.confirmEditHeaderCallback('incomes', header);
  }
  editHeaderCancel = (header: any) => {
    this.setState({
      editLabel: this.props.header.label || '',
      editPretax: this.props.header.pretax || false,
      editCount: this.props.header.count || 1
    });
    this.props.cancelEditHeaderCallback('incomes', header);
  }
  editHeader = (header: any) => {
    this.props.editHeaderCallback('incomes', header);
  }
  removeHeader = (header: any) => {
    this.props.deleteHeaderCallback('incomes', header);
  }
  moveUpHeader = (index: any) => {
    this.props.moveUpHeaderCallback('incomes', index);
  }
  moveDownHeader = (index: any) => {
    this.props.moveDownHeaderCallback('incomes', index);
  }
  render () {
    const { header, index, bank }  = this.props;

    return (
      <div className="form-row form-headers">
        <div className="col-7">
          <span className={`label-fake-input ${helpers.hideIf(header.$edit)}`}>
            {header.label}
          </span>
          <input type="text" 
                 name="editLabel"
                 value={this.state.editLabel} 
                 onChange={this.handleInputChange} 
                 className={`form-control ${helpers.showIf(header.$edit)}`} />
        </div>
        <div className="col-2">
          <div style={{display: 'inline-block'}}>
          <i className={`fa ${header.pretax?'fa-check-square-o':'fa-square-o'} ${helpers.hideIf(header.$edit)}`}></i>
            <label>
              <input type="checkbox"
                     name="editPretax"
                     checked={this.state.editPretax}  
                     onChange={this.handleInputChange} 
                     className={helpers.showIf(header.$edit)} />
              <span className="ml-1">Pre-tax</span>
            </label>
          </div>

          <div className={`btn-group ml-3 ${helpers.hideIf(header.$edit)}`}>
            <label className={`disabled btn ${header.count === 1 ? 'btn-secondary' : 'btn-light'}`}>1</label>
            <label className={`disabled btn ${header.count === 2 ? 'btn-secondary' : 'btn-light'}`}>2</label>
          </div>

          <div className={`btn-group ml-3 ${helpers.showIf(header.$edit)}`}>
            <label className={`btn ${this.state.editCount === 1 ? 'btn-primary' : 'btn-light'}`} onClick={e => {this.setState({editCount: 1});}}>1</label>
            <label className={`btn ${this.state.editCount === 2 ? 'btn-primary' : 'btn-light'}`} onClick={e => {this.setState({editCount: 2});}}>2</label>
          </div>
        </div>
        <div className="col-3" style={{textAlign: 'right'}}>
          <span className={`btn btn-link ${helpers.showIf(header.$edit)}`} onClick={e => this.editHeaderConfirm(header)}>
            <i className="fa fa-lg fa-check"></i>
          </span>
          <span className={`btn btn-link ${helpers.showIf(header.$edit)}`} onClick={e => this.editHeaderCancel(header)}>
            <i className="fa fa-lg fa-times"></i>
          </span>
          <span className={`btn btn-link ${helpers.hideIf(header.$edit)}`} onClick={e => this.editHeader(header)}>
            <i className="fa fa-lg fa-pencil"></i>
          </span>
          <span className={`btn btn-link ${helpers.hideIf(header.$edit)}`} onClick={e => this.removeHeader(header)}>
            <i className="fa fa-lg fa-trash-o"></i>
          </span>
          <span className={`btn btn-link ${helpers.hideIf(header.$edit)} ${(index === 0) ? 'disabled' : ''}`} onClick={e => this.moveUpHeader(index)}>
            <i className="fa fa-lg fa-chevron-up"></i>
          </span>
          <span className={`btn btn-link ${helpers.hideIf(header.$edit)} ${(index >= bank.headers.savings.length-1) ? 'disabled' : ''}`} onClick={e => this.moveDownHeader(index)}>
            <i className="fa fa-lg fa-chevron-down"></i>
          </span>
        </div>
      </div>
    );
  }
}
