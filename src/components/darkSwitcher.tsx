import React, { Dispatch } from 'react';
import { connect } from 'react-redux';

import { setDarkMode } from '../actions';
import { AppState } from '../store';

interface IProps {
  darkMode: boolean;
  onSetDarkMode: (darkMode: boolean) => void;
}

const DarkSwitcher = (props: IProps) => {
  const handleClick = () => {
    props.onSetDarkMode(!props.darkMode);
  };

  return (
    <span className="no-link" onClick={handleClick}>
      {props.darkMode ? 'Turn on the light' : 'Go Dark'}
    </span>
  )
  
  // return (
  //   <div className="checkbox">
  //     <label>
  //       <input
  //         type="checkbox" 
  //         name="editInterest" 
  //         checked={props.darkMode || false} 
  //         onChange={handleClick} 
  //       /> DARK MODE
  //     </label>
  //   </div>
  // );
}

const mapStateToProps = (state: AppState) => {
  return ({
    darkMode: state.sessionState.darkMode,
  });
}


const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onSetDarkMode: (darkMode: boolean) => dispatch(setDarkMode(darkMode))
  }
}

export default connect(
  mapStateToProps, 
  mapDispatchToProps,
)(DarkSwitcher);
