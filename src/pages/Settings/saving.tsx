import React from 'react';
import { connect } from 'react-redux';
import { 
  updateValue, 
  updateSavingHeader, 
  confirmUpdateSavingHeader, 
  cancelUpdateSavingHeader,
  deleteSavingHeader,
  switchSavingHeaders
} from '../../actions';
import { Row, Col } from 'reactstrap';
import * as Bank from '../../bank';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ISavingsHeader } from '../../bank/interfaces';


interface IProps {
  index: number,
  header: any,
  bank: Bank.IBank,
  bankLoaded: boolean,
  onUpdateValue: (bank: Bank.IBank, index: string, indexes: string[], amount: number|boolean) => void,
  onUpdateSavingHeader: (header: ISavingsHeader) => void,
  onConfirmUpdateSavingHeader: (header: ISavingsHeader) => void,
  onCancelUpdateSavingHeader: (header: ISavingsHeader) => void,
  onDeleteSavingHeader: (header: ISavingsHeader) => void,
  onSwitchSavingHeaders: (index1: number, index2: number) => void,
}

interface IState {
  editLabel: string,
  editSublabel: string,
  editIcon: string,
  editInterest: boolean
}

class Saving extends React.Component<IProps, IState> {
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

  editHeader = (header: any) => {
    this.props.onUpdateSavingHeader(header);
  }

  editHeaderConfirm = (header: any) => {
    header.label = this.state.editLabel;
    header.sublabel = this.state.editSublabel;
    header.icon = this.state.editIcon;
    header.interest = this.state.editInterest;

    this.props.onConfirmUpdateSavingHeader(header);
  }

  editHeaderCancel = (header: any) => {
    this.setState({
      editLabel: this.props.header.label || '',
      editSublabel: this.props.header.sublabel || '',
      editIcon: this.props.header.icon || '',
      editInterest: this.props.header.interest || ''
    });
    
    this.props.onCancelUpdateSavingHeader(header);
  }

  removeHeader = (header: any) => {
    this.props.onDeleteSavingHeader(header);
  }

  moveUpHeader = (index: any) => {
    if (index <= 0 || index >= this.props.bank.headers.savings.length) return;	

    this.props.onSwitchSavingHeaders(index-1, index);
  }

  moveDownHeader = (index: any) => {
    if (index < 0 || index >= this.props.bank.headers.savings.length - 1) return;

    this.props.onSwitchSavingHeaders(index, index+1);
  }

  render () {
    const { header, index, bank }  = this.props;

    return (
      <Row className="form-headers">
        <Col xs={12} sm={2}>
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
        <Col xs={12} sm={2}>
          {!header.$edit && <span className="label-fake-input">
            {header.sublabel}
          </span>}
          {header.$edit && <input
            type="text"
            name="editSublabel"
            value={this.state.editSublabel} 
            onChange={this.handleInputChange} 
            className="form-control" 
          />}
        </Col>
        <Col xs={12} sm={4}>
          {!header.$edit && <span className="label-fake-input nowrap-ellipsis">
            {header.icon}
          </span>}
          {header.$edit && <input
            type="text"       
            name="editIcon"
            value={this.state.editIcon} 
            onChange={this.handleInputChange} 
            className="form-control" 
          />}
        </Col>
        <Col xs={5} sm={2}>
          <div className="checkbox">
            {!header.$edit && <FontAwesomeIcon icon={['far', header.interest?'check-square':'square']} className="mr-1" />}
            <label>
              {header.$edit && <input
                type="checkbox" 
                name="editInterest" 
                checked={this.state.editInterest} 
                onChange={this.handleInputChange} 
              />} Interest
            </label>
          </div>
        </Col>
        <Col xs={7} sm={2} className="text-right">
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
          {!header.$edit && <span className={`btn btn-link ${(index >= bank.headers.savings.length-1) ? 'disabled' : ''}`} onClick={e => this.moveDownHeader(index)}>
            <FontAwesomeIcon icon="chevron-down" size="lg" />
          </span>}
        </Col>
      {/* </div> */}
      {/* </FormGroup> */}
      </Row>
    );
  }
}

const mapStateToProps = (state: any) => {
  return ({
    bank: state.bankState.bank,
    bankLoaded: state.bankState.bankLoaded
  });
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onUpdateValue: (bank: Bank.IBank, index: string, indexes: string[], amount: number|boolean) => {
      dispatch(updateValue(bank, index, indexes, amount));
    },
    onUpdateSavingHeader: (header: ISavingsHeader) => {
      dispatch(updateSavingHeader(header));
    },
    onConfirmUpdateSavingHeader: (header: ISavingsHeader) => {
      dispatch(confirmUpdateSavingHeader(header));
    },
    onCancelUpdateSavingHeader: (header: ISavingsHeader) => {
      dispatch(cancelUpdateSavingHeader(header));
    },
    onDeleteSavingHeader: (header: ISavingsHeader) => {
      dispatch(deleteSavingHeader(header));
    },
    onSwitchSavingHeaders: (index1: number, index2: number) => {
      dispatch(switchSavingHeaders(index1, index2));
    }
  };
};


export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Saving);