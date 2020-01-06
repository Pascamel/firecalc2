import React, { Dispatch, useEffect } from 'react';
import { connect } from 'react-redux';

import { setDarkMode } from '../actions';
import { AppState } from '../store';

interface IProps {
  darkMode: boolean;
  onSetDarkMode: (darkMode: boolean) => void;
}

const DarkSwitcher = (props: IProps) => {
  const { onSetDarkMode } = props;
  useEffect(() => {
    const ls = parseInt(localStorage.getItem('darkMode') || '0');
    if (ls > 0) {
      onSetDarkMode(true);
    }
  }, [onSetDarkMode]);

  const handleClick = () => {
    localStorage.setItem('darkMode', !props.darkMode ? '1' : '0');
    props.onSetDarkMode(!props.darkMode);
  };

  return (
    <span className="no-link" onClick={handleClick}>
      <i className={`fa fa-lg ${props.darkMode ? 'fa-lightbulb-o' : 'fa-moon-o'} pr-2`} />   
      {props.darkMode ? 'Turn on the light' : 'Go Dark'}
    </span>
  )
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
