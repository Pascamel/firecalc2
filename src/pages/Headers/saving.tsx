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
  editSublabel: string,
  editIcon: string,
  editInterest: boolean
}

export default class Saving extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      editLabel: this.props.header.label || '',
      editSublabel: this.props.header.sublabel || '',
      editIcon: this.props.header.icon || '',
      editInterest: this.props.header.interest || false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange = (event: any) => {
    const s: any = {};
    s[event.target.name] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState(s);
  }

  editHeaderConfirm = (header: any) => {
    header.label = this.state.editLabel;
    header.sublabel = this.state.editSublabel;
    header.icon = this.state.editIcon;
    header.interest = this.state.editInterest;
    this.props.confirmEditHeaderCallback('savings', header);
  }

  editHeaderCancel = (header: any) => {
    this.setState({
      editLabel: this.props.header.label || '',
      editSublabel: this.props.header.sublabel || '',
      editIcon: this.props.header.icon || '',
      editInterest: this.props.header.interest || ''
    });
    this.props.cancelEditHeaderCallback('savings', header);
  }

  editHeader = (header: any) => {
    this.props.editHeaderCallback('savings', header);
  }

  removeHeader = (header: any) => {
    this.props.deleteHeaderCallback('savings', header);
  }

  moveUpHeader = (index: any) => {
    this.props.moveUpHeaderCallback('savings', index);
  }

  moveDownHeader = (index: any) => {
    this.props.moveDownHeaderCallback('savings', index);
  }

  render () {
    const { header, index, bank }  = this.props;

    return (
      <div className="form-row form-headers">
        <div className="col-2">
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
          <span className={`label-fake-input ${helpers.hideIf(header.$edit)}`}>
            {header.sublabel}
          </span>
          <input type="text"
                 name="editSublabel"
                 value={this.state.editSublabel} 
                 onChange={this.handleInputChange} 
                 className={`form-control ${helpers.showIf(header.$edit)}`} />
        </div>
        <div className="col-4">
          <span className={`label-fake-input nowrap-ellipsis ${helpers.hideIf(header.$edit)}`}>
            {header.icon}
          </span>
          <input type="text"
                 name="editIcon"
                 value={this.state.editIcon} 
                 onChange={this.handleInputChange} 
                 className={`form-control ${helpers.showIf(header.$edit)}`} />
        </div>
        <div className="col-2">
          <div className="checkbox">
            <i className={`fa mr-1 ${header.interest?'fa-check-square-o':'fa-square-o'} ${helpers.hideIf(header.$edit)}`}></i>
            <label>
              <input type="checkbox" 
                     name="editInterest" 
                     checked={this.state.editInterest} 
                     onChange={this.handleInputChange} 
                     className={helpers.showIf(header.$edit)} /> Interest
            </label>
          </div>
        </div>
        <div className="col-2" style={{textAlign: 'right'}}>
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
