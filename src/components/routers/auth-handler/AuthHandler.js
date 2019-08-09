import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import AuthState from '@constants/AuthState';
import Loading from '@components/loading/Loading';
import AuthenticatedView from '@components/routers/authenticated-view/AuthenticatedView';

const Render = ({ auth, match, ...props }) => {
  if (auth === AuthState.UNKNOWN) {
    return <Loading />;
  }

  return auth === AuthState.AUTHENTICATED ? (
    <AuthenticatedView match={match} {...props} />
  ) : (
    <Redirect
      to={{
        pathname: '/',
        state:
          auth === AuthState.LOGOUT
            ? {
                originalMatchUrl: match.url,
              }
            : {},
      }}
    />
  );
};

Render.propTypes = {
  auth: PropTypes.number.isRequired,
  match: PropTypes.object.isRequired,
};

export default Render;
