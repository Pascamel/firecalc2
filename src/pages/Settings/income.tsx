import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';

import {
  cancelUpdateIncomeHeader,
  confirmUpdateIncomeHeader,
  deleteIncomeHeader,
  switchIncomeHeaders,
  updateIncomeHeader,
  updateValue
} from '../../actions';
import * as Bank from '../../bank';
import { IIncomeHeader } from '../../bank/interfaces';
import { AppState } from '../../store';

interface IProps {
  index: number;
  header: any;
  bank: Bank.IBank;
  bankLoaded: boolean;
  onUpdateValue: (index: string, indexes: string[], amount: number|boolean) => void;
  onUpdateIncomeHeader: (header: IIncomeHeader) => void;
  onConfirmUpdateIncomeHeader: (header: IIncomeHeader) => void;
  onCancelUpdateIncomeHeader: (header: IIncomeHeader) => void;
  onDeleteIncomeHeader: (header: IIncomeHeader) => void;
  onSwitchIncomeHeaders: (index1: number, index2: number) => void;
}

interface IState {
  editLabel: string;
  editPretax: boolean;
  editCount: number;
}

class Income extends React.Component<IProps, IState> {
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

  editHeader = (header: IIncomeHeader) => {
    this.props.onUpdateIncomeHeader(header);
  }

  editHeaderConfirm = (header: IIncomeHeader) => {
    header.label = this.state.editLabel;
    header.pretax = this.state.editPretax;
    header.count = this.state.editCount;

    this.props.onConfirmUpdateIncomeHeader(header);
  }
  editHeaderCancel = (header: IIncomeHeader) => {
    this.setState({
      editLabel: this.props.header.label || '',
      editPretax: this.props.header.pretax || false,
      editCount: this.props.header.count || 1
    });
    
    this.props.onCancelUpdateIncomeHeader(header);
  }
  
  removeHeader = (header: IIncomeHeader) => {
    this.props.onDeleteIncomeHeader(header);
  }

  moveUpHeader = (index: number) => {
    if (index <= 0 || index >= this.props.bank.headers.incomes.length) return;	

    this.props.onSwitchIncomeHeaders(index-1, index);
  }

  moveDownHeader = (index: number) => {
    if (index < 0 || index >= this.props.bank.headers.incomes.length - 1) return;

    this.props.onSwitchIncomeHeaders(index, index+1);
  }
  
  render() {
    const { header, index, bank }  = this.props;

    return (
      <Row className="form-headers">
        <Col xs={12} sm={6}>
          {!header.$edit && <span className="label-fake-input">
            {header.label}
          </span>}
            {header.$edit && <input
              type="text" 
              name="editLabel"
              value={this.state.editLabel} 
              onChange={this.handleInputChange} 
              className="form-control" 
            />}
        </Col>
        <Col xs={12} sm={3}>
          <div className="inline">
            {!header.$edit && <FontAwesomeIcon icon={['far', header.pretax?'check-square':'square']} />}
            <label>
              {header.$edit && <input
                type="checkbox"     
                name="editPretax"
                defaultChecked={this.state.editPretax}                          
                onChange={this.handleInputChange} 
              />}
              <span className="ml-1">Pre-tax</span>
            </label>
          </div>
          {!header.$edit && <div className="btn-group ml-3">
            <label className={`disabled btn ${header.count === 1 ? 'btn-secondary' : 'btn-light'}`}>1</label>
            <label className={`disabled btn ${header.count === 2 ? 'btn-secondary' : 'btn-light'}`}>2</label>
          </div>}
          {header.$edit && <div className="btn-group ml-3">
            <label className={`btn ${this.state.editCount === 1 ? 'btn-primary' : 'btn-light'}`} onClick={e => {this.setState({editCount: 1});}}>1</label>
            <label className={`btn ${this.state.editCount === 2 ? 'btn-primary' : 'btn-light'}`} onClick={e => {this.setState({editCount: 2});}}>2</label>
          </div>}
        </Col>
        <Col xs={12} sm={3} className="text-right">
          {header.$edit && <span className="btn btn-link" onClick={e => this.editHeaderConfirm(header)}>
            <FontAwesomeIcon icon="check" size="lg" />
          </span>}
          {header.$edit && <span className="btn btn-link" onClick={e => this.editHeaderCancel(header)}>
            <FontAwesomeIcon icon="times" size="lg" />
          </span>}
          {!header.$edit && <span className="btn btn-link" onClick={e => this.editHeader(header)}>
            <FontAwesomeIcon icon="edit" size="lg" />
          </span>}
          {!header.$edit && <span className="btn btn-link" onClick={e => this.removeHeader(header)}>
            <FontAwesomeIcon icon="trash-alt" size="lg" />
          </span>}
          {!header.$edit && <span className={`btn btn-link ${(index === 0) ? 'disabled' : ''}`} onClick={e => this.moveUpHeader(index)}>
            <FontAwesomeIcon icon="chevron-up" size="lg" />
          </span>}
          {!header.$edit && <span className={`btn btn-link ${(index >= bank.headers.incomes.length-1) ? 'disabled' : ''}`} onClick={e => this.moveDownHeader(index)}>
            <FontAwesomeIcon icon="chevron-down" size="lg" />
          </span>}
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return ({
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded
  });
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onUpdateValue: (index: string, indexes: string[], amount: number|boolean) => {
      dispatch(updateValue(index, indexes, amount));
    },
    onUpdateIncomeHeader: (header: IIncomeHeader) => {
      dispatch(updateIncomeHeader(header));
    },
    onConfirmUpdateIncomeHeader: (header: IIncomeHeader) => {
      dispatch(confirmUpdateIncomeHeader(header));
    },
    onCancelUpdateIncomeHeader: (header: IIncomeHeader) => {
      dispatch(cancelUpdateIncomeHeader(header));
    },
    onDeleteIncomeHeader: (header: IIncomeHeader) => {
      dispatch(deleteIncomeHeader(header));
    },
    onSwitchIncomeHeaders: (index1: number, index2: number) => {
      dispatch(switchIncomeHeaders(index1, index2));
    }
  };
};


export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Income);
