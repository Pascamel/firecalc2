import React, { Dispatch, useEffect } from 'react';
import { connect } from 'react-redux';

import { setDarkMode } from '../actions';
import { AppState } from '../store';

interface IProps {
  darkMode: boolean;
  onSetDarkMode: (darkMode: boolean) => void;
}

const DarkSwitcher = ({ darkMode, onSetDarkMode }: IProps) => {
  const icon = darkMode ? 'fa-lightbulb-o' : 'fa-moon-o';
  const label = darkMode ? 'Turn on the light' : 'Go Dark';

  useEffect(() => {
    const ls = parseInt(localStorage.getItem('darkMode') || '0');
    if (ls > 0) {
      onSetDarkMode(true);
    }
  }, [onSetDarkMode]);

  const handleClick = () => {
    localStorage.setItem('darkMode', !darkMode ? '1' : '0');
    onSetDarkMode(!darkMode);
  };

  return (
    <span className="no-link" onClick={handleClick}>
      <i className={`fa fa-lg fa-fw ${icon}`} />
      {label}
    </span>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    darkMode: state.sessionState.darkMode
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onSetDarkMode: (darkMode: boolean) => dispatch(setDarkMode(darkMode))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DarkSwitcher);
