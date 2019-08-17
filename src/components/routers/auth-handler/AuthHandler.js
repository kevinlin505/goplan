import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthState from '@constants/AuthState';
import Loading from '@components/loading/Loading';
import NavigationBar from '@components/navigation/NavigationBar';

const Render = ({ auth, match, component: Component, ...props }) => {
  if (auth === AuthState.UNKNOWN) {
    return <Loading />;
  }

  return auth === AuthState.AUTHENTICATED ? (
    <React.Fragment>
      <NavigationBar />
      <Component match={match} {...props} />
    </React.Fragment>
  ) : (
    <Redirect
      to={{
        pathname: '/',
        state:
          auth === AuthState.LOGOUT
            ? {}
            : {
                originalMatchUrl: match.url,
              },
      }}
    />
  );
};

Render.propTypes = {
  auth: PropTypes.number.isRequired,
  component: PropTypes.any.isRequired,
  match: PropTypes.object.isRequired,
};

export default Render;
